import { NextRequest, NextResponse } from "next/server";

const globalJobs = (globalThis as any).videoJobs || new Map();
if (!(globalThis as any).videoJobs) {
  (globalThis as any).videoJobs = globalJobs;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // In Next 15, dynamic route params is a Promise
) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
  }

  const job = globalJobs.get(id);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}
