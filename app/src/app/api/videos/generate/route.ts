import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import Replicate from "replicate";
import fs from "fs/promises";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import { supabaseAdmin } from "@/lib/supabase-client";

// Setup global store and paths
if (process.env.FFMPEG_PATH) ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

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

    // Use placeholder IDs if missing for MVP since the UI sends names/text directly for now
    
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
    globalJobs.set(jobId, { status: "rendering", renderStep: 0 });
    const workDir = path.join(os.tmpdir(), `job-${jobId}`);
    await fs.mkdir(workDir, { recursive: true });

    // Step 1: Generate script audio (ElevenLabs TTS)
    globalJobs.set(jobId, { status: "rendering", renderStep: 1 });
    const audioPath = path.join(workDir, "audio.mp3");
    
    // Minimal mock script selection based on the frontend's IDs
    const scriptTexts: Record<string, string> = {
      pain: "If your leggings are distracting you mid-flow, they're already failing you. Lululemon Align pant.",
      lifestyle: "This is what 6am looks like when you actually love your routine. Lululemon Align pant.",
      social: "I've tried 11 leggings. I stopped looking after these. Shop the Align collection."
    };
    const ttsText = scriptTexts[scriptId] || scriptTexts.pain;

    const elelabsRes = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: ttsText,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    
    if (!elelabsRes.ok) throw new Error(`ElevenLabs failed: ${await elelabsRes.text()}`);
    const audioBuffer = Buffer.from(await elelabsRes.arrayBuffer());
    await fs.writeFile(audioPath, audioBuffer);
    
    // Step 2: Generate Video via Replicate (Text to Video)
    globalJobs.set(jobId, { status: "rendering", renderStep: 2 });
    const productPrompts: Record<string, string> = {
      align: "A 26-year-old athletic woman with a sleek high ponytail, confidently posing in a yoga studio, wearing Lululemon Align Pants. Professional product photography lighting, slow pan.",
      define: "A 26-year-old athletic woman wearing a fitted black Lululemon Define Jacket, zipping it up on an outdoor track. Golden hour lighting, cinematic.",
      swiftly: "A fit female runner sweating but smiling in a bright red Lululemon Swiftly Tech tank top. High quality, beautiful bokeh, 4k.",
      abc: "Athletic male influencer showing off flexible Lululemon ABC pants in a modern apartment, stretching comfortably. Commercial aesthetic."
    };
    const t2vPrompt = productPrompts[productId] || productPrompts.align;

    let outputVideoUrl = "";
    
    // Call Replicate Minimax (very fast T2V model)
    const output = await replicate.run(
      "minimax/video-01",
      {
        input: {
          prompt: t2vPrompt,
          prompt_optimizer: true
        }
      }
    );
    
    // replicate minimax output is typically an array of strings or a stream url
    outputVideoUrl = Array.isArray(output) ? output[0] : (typeof output === "string" ? output : (output as any).url);
    if (!outputVideoUrl) throw new Error("Replicate video generation returned empty output.");
    
    globalJobs.set(jobId, { status: "rendering", renderStep: 3 });

    // Download Replicate output MP4
    const vidRes = await fetch(outputVideoUrl);
    if (!vidRes.ok) throw new Error("Failed to download replicate video");
    const rawVideoPath = path.join(workDir, "raw_video.mp4");
    await fs.writeFile(rawVideoPath, Buffer.from(await vidRes.arrayBuffer()));

    // Step 3: Composite Video + Audio with FFmpeg
    globalJobs.set(jobId, { status: "rendering", renderStep: 4 });
    const finalOutputPath = path.join(workDir, "final_video.mp4");

    await new Promise((resolve, reject) => {
      ffmpeg(rawVideoPath)
        .addInput(audioPath)
        .outputOptions([
          "-c:v copy",   // Keep the high quality replicate video intact
          "-c:a aac",
          "-shortest",   // End the video when the shortest stream (audio/video) ends
          "-movflags faststart"
        ])
        .save(finalOutputPath)
        .on("end", resolve)
        .on("error", reject);
    });

    // Step 4: Upload final MP4 to Supabase Storage
    globalJobs.set(jobId, { status: "rendering", renderStep: 5 });
    const finalBuffer = await fs.readFile(finalOutputPath);
    const mediaPath = `videos/gen-${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;
    
    let base64Data = `data:video/mp4;base64,${finalBuffer.toString('base64')}`;
    let finalVideoUrl = base64Data;
    
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: uploadData, error: uploadError } = await supabaseAdmin
        .storage
        .from("media")
        .upload(mediaPath, finalBuffer, { contentType: "video/mp4" });
        
      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage.from("media").getPublicUrl(mediaPath);
        finalVideoUrl = urlData.publicUrl;
        
        // Log generation in DB if table exists (fire and forget)
        supabaseAdmin.from("video_generations").insert({
          status: "completed",
          video_url: finalVideoUrl,
        }).then(({ error }) => {
           if (error) console.error("Could not insert video record (table might not exist yet):", error.message);
        });
      } else {
        console.error("Supabase video upload failed, falling back to base64 output", uploadError);
      }
    }

    // Clean up temp directory
    await fs.rm(workDir, { recursive: true, force: true }).catch(console.error);

    globalJobs.set(jobId, { 
      status: "success", 
      renderStep: 5, 
      videoUrl: finalVideoUrl 
    });
    
  } catch (err: any) {
    console.error("Video processing error:", err);
    globalJobs.set(jobId, { status: "failed", error: err.message });
  }
}
