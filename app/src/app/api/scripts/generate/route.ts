import { NextRequest, NextResponse } from "next/server";

// POST /api/scripts/generate
// Body: { productId: string, brandVoice: string, demographic: string }
// Returns: { scripts: ScriptOption[] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, brandVoice, demographic } = body;

    if (!productId || !brandVoice || !demographic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: call Claude API to generate 3 script options
    // See claude.md for the full prompt chain specification

    return NextResponse.json({ scripts: [] }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
