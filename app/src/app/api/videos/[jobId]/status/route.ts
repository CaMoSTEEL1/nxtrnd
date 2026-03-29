import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/job-cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  try {
    const job = getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { error: "Job not found", jobId },
        { status: 404 }
      );
    }

    return NextResponse.json({
      jobId,
      status: job.status,
      voiceoverUrl: job.voiceoverUrl,
      influencerVideoUrl: job.influencerVideoUrl,
      finalVideoUrl: job.finalVideoUrl,
      error: job.error,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
