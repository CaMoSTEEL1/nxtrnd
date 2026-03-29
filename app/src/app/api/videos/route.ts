import { NextRequest, NextResponse } from "next/server";

// GET /api/videos
// Returns: { videos: VideoGeneration[] }

export async function GET(req: NextRequest) {
  try {
    // In production, fetch from Supabase video_generations table
    // For now, return empty array
    const videos: any[] = [];

    return NextResponse.json(
      {
        videos,
        count: videos.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching videos:", err);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
