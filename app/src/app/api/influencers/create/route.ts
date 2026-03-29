import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { generateInfluencerImage } from "@/lib/image-generator";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/influencers/create
// Body: { archetype: string, brand: string, targetDemographic: string }
// Returns: { influencer: { id, name, archetype, imageUrl, description } }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { archetype, brand, targetDemographic } = body;

    if (!archetype || !brand || !targetDemographic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Step 1: Generate persona name and description using Claude
    const personaResponse = await anthropic.messages.create({
      model: "claude-opus-4",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Generate a realistic AI influencer persona for a ${archetype} archetype who would promote ${brand} to ${targetDemographic} audiences.

Provide:
1. First and last name
2. Instagram/TikTok handle (format: @username)
3. Bio (1-2 sentences)
4. Key personality traits (3-4 traits)

Format as JSON:
{
  "name": "Full Name",
  "handle": "@handle",
  "bio": "Bio text",
  "traits": ["trait1", "trait2", "trait3"]
}`,
        },
      ],
    });

    const personaContent = personaResponse.content[0];
    if (personaContent.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const persona = JSON.parse(personaContent.text);

    // Step 2: Generate influencer reference image
    const imageUrl = await generateInfluencerImage(persona.name, archetype);

    // Step 3: Create influencer object (in production, save to Supabase)
    const influencer = {
      id: `influencer-${Date.now()}`,
      name: persona.name,
      handle: persona.handle,
      archetype,
      bio: persona.bio,
      traits: persona.traits,
      imageUrl,
      brand,
      targetDemographic,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        influencer,
        message: "Influencer persona created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Influencer creation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create influencer" },
      { status: 500 }
    );
  }
}
