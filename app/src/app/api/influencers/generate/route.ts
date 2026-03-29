import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { personaDescription } = await req.json();

    if (!personaDescription) {
      return NextResponse.json({ error: "Missing persona description" }, { status: 400 });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${personaDescription}
      
      TECHNICAL REQUIREMENTS:
      - Photorealistic professional headshot
      - Studio photography with high-end lighting
      - 4K quality, sharp facial details
      - Magazine cover aesthetic
      - Natural makeup, professional styling
      - Clean background, minimal distractions
      - Instagram influencer standard`,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image generated");

    return NextResponse.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error("Image generation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
