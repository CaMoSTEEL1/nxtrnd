import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  try {
    // In production, fetch the actual video file from Supabase Storage
    // and return it as a download

    // For now, return a mock video response
    const mockVideoBuffer = Buffer.from("MOCK_VIDEO_DATA");

    return new NextResponse(mockVideoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="video-${jobId}.mp4"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
