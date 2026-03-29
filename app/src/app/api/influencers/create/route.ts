import { NextRequest, NextResponse } from "next/server";
import { generateInfluencerImage } from "@/lib/image-generator";

const ARCHETYPE_PERSONAS: Record<string, { names: string[]; traits: string[]; bioTemplate: string }> = {
  fit_girl: {
    names: ["Maya Torres", "Zoe Kim", "Ava Patel", "Leila Nguyen", "Sofia Reyes"],
    traits: ["Motivating", "Authentic", "Health-conscious", "Empowering"],
    bioTemplate: `Fitness creator helping women build strength and confidence. Partnering with ${"{brand}"} to bring you the best in athletic performance.`,
  },
  gym_bro: {
    names: ["Marcus Reid", "Jake Chen", "Tyler Brooks", "Damon West", "Nate Silva"],
    traits: ["Driven", "Disciplined", "High-energy", "Results-focused"],
    bioTemplate: `Performance athlete obsessed with gains. ${"{brand}"} fuels my grind — let it fuel yours.`,
  },
  runner: {
    names: ["Ellie Park", "Jordan Hayes", "Sam Okafor", "Riley Moss", "Casey Lin"],
    traits: ["Endurance-focused", "Goal-oriented", "Consistent", "Community-driven"],
    bioTemplate: `Distance runner chasing PRs and pushing limits with ${"{brand}"} every mile.`,
  },
  lifestyle: {
    names: ["Chloe Bennett", "Alex Morgan", "Jamie Wu", "Drew Santos", "Sage Taylor"],
    traits: ["Trendy", "Relatable", "Balanced", "Aspirational"],
    bioTemplate: `Living actively and authentically. ${"{brand}"} fits the way I move through life.`,
  },
};

function buildPersona(archetype: string, brand: string) {
  const config = ARCHETYPE_PERSONAS[archetype] ?? ARCHETYPE_PERSONAS.lifestyle;
  const name = config.names[Math.floor(Math.random() * config.names.length)];
  const handle = `@${name.split(" ")[0].toLowerCase()}${name.split(" ")[1].toLowerCase()}`;
  const bio = config.bioTemplate.replace("{brand}", brand);
  return { name, handle, bio, traits: config.traits };
}

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

    // Step 1: Build persona metadata directly from archetype + brand
    const persona = buildPersona(archetype, brand);

    // Step 2: Generate influencer reference image
    const imageUrl = await generateInfluencerImage(persona.name, archetype, brand, targetDemographic);

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
