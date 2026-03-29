import { NextRequest, NextResponse } from "next/server";

// GET /api/jobs/[id]/status
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const globalJobs = (globalThis as any).videoJobs as Map<string, any> | undefined;

  if (!globalJobs || !globalJobs.has(id)) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const job = globalJobs.get(id);
  return NextResponse.json({ jobId: id, ...job });
}
