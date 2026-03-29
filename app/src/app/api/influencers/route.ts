import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-client";

// GET /api/influencers
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ influencers: [], count: 0 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("influencer_personas")
      .select("id, name, archetype, style_notes, reference_photo_url")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching influencers:", error);
      return NextResponse.json({ influencers: [], count: 0 });
    }

    const influencers = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      archetype: row.archetype,
      imageUrl: row.reference_photo_url || null,
    }));

    return NextResponse.json({ influencers, count: influencers.length });
  } catch (err: any) {
    console.error("Error fetching influencers:", err);
    return NextResponse.json({ influencers: [], count: 0 });
  }
}
