import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { brand, sport, demographic, tone, productDescription } = await req.json();

    if (!productDescription) {
      return NextResponse.json({ error: "Missing product description" }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1500,
        system: `You are an expert UGC video script writer for sports brands. 
        Generate 3 completely different short-form video scripts (TikTok/Reels style) for this product.
        Each script must be exactly 30 seconds max when spoken.
        Output MUST be valid JSON matching this schema exactly:
        {
          "scripts": [
            {
              "id": "unique-id",
              "name": "Short Angle Title (e.g. 'Pain-point', 'Lifestyle')",
              "text": "The full spoken text and visual notes for the influencer."
            }
          ]
        }`,
        messages: [
          {
            role: "user",
            content: `Create 3 scripts.
            Brand: ${brand || "NextLayer Sports"}
            Category: ${sport || "fitness"}
            Target Demographics: ${demographic || "Gen Z"}
            Brand Tone: ${tone || "energetic"}
            Product: ${productDescription}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${await response.text()}`);
    }

    const anthropicData = await response.json();
    const rawText = anthropicData.content[0].text;
    
    // Parse JSON block from Claude
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : rawText;
    
    const parsedData = JSON.parse(jsonStr);
    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Script generation failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
