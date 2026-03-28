import { NextRequest, NextResponse } from "next/server";

// GET /api/videos/[id]/status
// Returns: { status: "queued" | "processing" | "complete" | "error", videoUrl?: string }
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing video id" }, { status: 400 });
  }

  // TODO: fetch from video_generations table in Supabase

  return NextResponse.json({ status: "queued", videoUrl: null }, { status: 200 });
}
