import { NextRequest, NextResponse } from "next/server";

// GET /api/influencers
// Returns: { influencers: Influencer[] }

export async function GET(req: NextRequest) {
  try {
    // In production, fetch from Supabase
    // For now, return mock influencers
    const influencers = [
      {
        id: "ava",
        name: "Ava Chen",
        handle: "@ava.moves",
        archetype: "fit_girl",
        bio: "Yoga instructor and fitness enthusiast",
        traits: ["authentic", "peaceful", "inspiring"],
        imageUrl: "https://via.placeholder.com/500x500?text=Ava+Chen",
      },
      {
        id: "marcus",
        name: "Marcus Reid",
        handle: "@marcuslifts",
        archetype: "gym_bro",
        bio: "Strength coach and fitness content creator",
        traits: ["energetic", "motivating", "knowledgeable"],
        imageUrl: "https://via.placeholder.com/500x500?text=Marcus+Reid",
      },
      {
        id: "priya",
        name: "Priya Nair",
        handle: "@runwithpriya",
        archetype: "runner",
        bio: "Marathon runner and fitness coach",
        traits: ["determined", "adventurous", "supportive"],
        imageUrl: "https://via.placeholder.com/500x500?text=Priya+Nair",
      },
      {
        id: "jordan",
        name: "Jordan Ellis",
        handle: "@jordo.daily",
        archetype: "lifestyle",
        bio: "Lifestyle creator and wellness advocate",
        traits: ["relatable", "positive", "inclusive"],
        imageUrl: "https://via.placeholder.com/500x500?text=Jordan+Ellis",
      },
    ];

    return NextResponse.json(
      {
        influencers,
        count: influencers.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching influencers:", err);
    return NextResponse.json(
      { error: "Failed to fetch influencers" },
      { status: 500 }
    );
  }
}
