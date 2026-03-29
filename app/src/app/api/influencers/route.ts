import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-client";

// GET /api/influencers
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("influencer_personas")
      .select("id, name, archetype, style_notes, reference_photo_url")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const influencers = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      archetype: row.archetype,
      imageUrl: row.reference_photo_url || null,
    }));

    return NextResponse.json({ influencers, count: influencers.length });
  } catch (err: any) {
    console.error("Error fetching influencers:", err);
    return NextResponse.json({ error: "Failed to fetch influencers" }, { status: 500 });
  }
}
