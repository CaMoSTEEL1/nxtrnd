import Anthropic from "@anthropic-ai/sdk";

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export interface GeneratedScript {
  angle: string;
  hook: string;
  body: string;
  cta: string;
  duration: string;
  tag: string;
}

/**
 * Generate 3 script options using Claude Opus
 * Each script has a different angle: pain-point, lifestyle, social-proof
 */
export async function generateScripts(
  productName: string,
  brandVoice: string,
  targetDemographic: string
): Promise<GeneratedScript[]> {
  try {
    const prompt = `You are a creative copywriter specializing in short-form UGC video content for fitness and lifestyle brands.

Generate exactly 3 different script variations for a 30-second TikTok/Reel featuring the product "${productName}".

Brand Voice: ${brandVoice}
Target Demographic: ${targetDemographic}

For each script, provide:
1. Script Angle (e.g., "Pain-point", "Lifestyle", "Social proof")
2. Hook (first 3 seconds - attention-grabbing statement)
3. Body (product showcase and benefit narrative)
4. CTA (call-to-action)
5. Duration (estimated timing, e.g., "0:00-0:28")
6. Tag (e.g., "Highest converter", "Brand awareness", "Trust builder")

Format your response as a JSON array with 3 objects, no markdown backticks:
[
  {
    "angle": "Pain-point",
    "hook": "...",
    "body": "...",
    "cta": "...",
    "duration": "0:00-0:28",
    "tag": "Highest converter"
  },
  ...
]`;

    const message = await getClient().messages.create({
      model: "claude-opus-4",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Parse JSON response
    const scripts = JSON.parse(content.text) as GeneratedScript[];

    if (!Array.isArray(scripts) || scripts.length !== 3) {
      throw new Error("Expected 3 scripts from Claude");
    }

    return scripts;
  } catch (err) {
    console.error("Script generation failed:", err);
    throw new Error(
      `Script generation error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}
