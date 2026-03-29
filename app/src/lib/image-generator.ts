import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

/**
 * Generate product showcase image using DALL-E 3
 * Creates a professional product photo with lifestyle context
 */
export async function generateProductImage(
  productName: string,
  description: string,
  targetDemographic: string
): Promise<string> {
  try {
    const prompt = `Create a professional, high-quality product photo of "${productName}". 
    ${description}
    Target audience: ${targetDemographic}
    Style: Bright, clean, modern lifestyle photography. Product should be prominently featured and well-lit. 
    Professional ecommerce quality.`;

    const response = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data || response.data.length === 0 || !response.data[0].url) {
      throw new Error("Failed to generate image");
    }

    return response.data[0].url;
  } catch (err) {
    console.error("Product image generation failed:", err);
    throw new Error(
      `Image generation error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}

/**
 * Generate influencer reference image using DALL-E 3
 */
export async function generateInfluencerImage(
  name: string,
  archetype: string,
  brand?: string,
  targetDemographic?: string
): Promise<string> {
  try {
    const archetypeDesc: { [key: string]: string } = {
      fit_girl: "athletic woman in her mid-20s, lean and toned build, confident natural expression, wearing a minimalist sports bra and high-waist leggings, diverse ethnicity",
      gym_bro: "athletic man in his late 20s, muscular build, confident and approachable expression, wearing a fitted gym shirt, diverse ethnicity",
      runner: "lean athletic person in their mid-20s, runner's physique, energetic and determined expression, wearing running gear with compression tights",
      lifestyle: "stylish person in their mid-20s, confident and approachable, wearing trendy athleisure or casual wear, diverse ethnicity",
    };

    const desc = archetypeDesc[archetype] || archetypeDesc.lifestyle;
    const brandContext = brand ? ` representing ${brand}` : "";
    const demographicContext = targetDemographic ? ` appealing to ${targetDemographic}` : "";

    const prompt = `Professional social media influencer portrait${brandContext}${demographicContext}. ${desc}. Studio photography: soft box lighting, clean white or light gray background, sharp facial details, magazine-quality composition. Authentic, aspirational Instagram/TikTok influencer aesthetic. Photorealistic, 4K quality. NOT illustrated or AI-looking.`;

    const response = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data || response.data.length === 0 || !response.data[0].url) {
      throw new Error("Failed to generate influencer image");
    }

    return response.data[0].url;
  } catch (err) {
    console.error("Influencer image generation failed:", err);
    throw new Error(
      `Influencer image generation error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
}
