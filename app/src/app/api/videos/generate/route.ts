import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 60;
import { v4 as uuidv4 } from "uuid";
import Replicate from "replicate";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { supabaseAdmin } from "@/lib/supabase-client";

function getReplicate() { return new Replicate({ auth: process.env.REPLICATE_API_TOKEN }); }

// Use a global map to store generation jobs
const globalJobs = (globalThis as any).videoJobs || new Map();
if (!(globalThis as any).videoJobs) {
  (globalThis as any).videoJobs = globalJobs;
}

// POST /api/videos/generate
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { influencerId, scriptId, productId } = body;

    const jobId = uuidv4();
    globalJobs.set(jobId, { status: "queued", renderStep: 0 });

    // Fire and forget
    processVideoGeneration(jobId, influencerId, scriptId, productId).catch(console.error);

    return NextResponse.json({ jobId, status: "queued" }, { status: 202 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

async function processVideoGeneration(
  jobId: string,
  influencerId: string,
  scriptId: string,
  productId: string
) {
  try {
    globalJobs.set(jobId, { status: "rendering", renderStep: 1 });
    const workDir = path.join(os.tmpdir(), `job-${jobId}`);
    await fs.mkdir(workDir, { recursive: true });

    // Step 1: Generate Video via Replicate (video includes embedded audio)
    const productPrompts: Record<string, string> = {
      align: "A 26-year-old athletic woman with a sleek high ponytail, confidently posing in a yoga studio, wearing Lululemon Align Pants. Professional product photography lighting, slow pan.",
      define: "A 26-year-old athletic woman wearing a fitted black Lululemon Define Jacket, zipping it up on an outdoor track. Golden hour lighting, cinematic.",
      swiftly: "A fit female runner sweating but smiling in a bright red Lululemon Swiftly Tech tank top. High quality, beautiful bokeh, 4k.",
      abc: "Athletic male influencer showing off flexible Lululemon ABC pants in a modern apartment, stretching comfortably. Commercial aesthetic."
    };
    const t2vPrompt = productPrompts[productId] || productPrompts.align;

    const output = await getReplicate().run(
      "minimax/video-01",
      {
        input: {
          prompt: t2vPrompt,
          prompt_optimizer: true
        }
      }
    );

    const outputVideoUrl = Array.isArray(output) ? output[0] : (typeof output === "string" ? output : (output as any).url);
    if (!outputVideoUrl) throw new Error("Replicate video generation returned empty output.");

    globalJobs.set(jobId, { status: "rendering", renderStep: 2 });

    // Step 2: Download video
    const vidRes = await fetch(outputVideoUrl);
    if (!vidRes.ok) throw new Error("Failed to download replicate video");
    const rawVideoPath = path.join(workDir, "video.mp4");
    await fs.writeFile(rawVideoPath, Buffer.from(await vidRes.arrayBuffer()));

    // Step 3: Upload to Supabase Storage
    globalJobs.set(jobId, { status: "rendering", renderStep: 3 });
    const videoBuffer = await fs.readFile(rawVideoPath);
    const mediaPath = `videos/gen-${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;

    let finalVideoUrl = `data:video/mp4;base64,${videoBuffer.toString("base64")}`;

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from("media")
        .upload(mediaPath, videoBuffer, { contentType: "video/mp4" });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from("media").getPublicUrl(mediaPath);
        finalVideoUrl = urlData.publicUrl;

        supabaseAdmin.from("video_generations").insert({
          status: "completed",
          video_url: finalVideoUrl,
        }).then(({ error }) => {
          if (error) console.error("Could not insert video record:", error.message);
        });
      } else {
        console.error("Supabase upload failed, using base64 fallback:", uploadError);
      }
    }

    await fs.rm(workDir, { recursive: true, force: true }).catch(console.error);

    globalJobs.set(jobId, { status: "success", renderStep: 3, videoUrl: finalVideoUrl });

  } catch (err: any) {
    console.error("Video processing error:", err);
    globalJobs.set(jobId, { status: "failed", error: err.message });
  }
}
