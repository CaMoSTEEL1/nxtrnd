import { NextResponse } from "next/server";

// GET /api/scripts
// Returns saved scripts. Currently returns empty until a scripts table is provisioned.
export async function GET() {
  return NextResponse.json({ scripts: [], count: 0 });
}
