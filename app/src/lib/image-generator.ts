import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await openai.images.generate({
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
  archetype: string
): Promise<string> {
  try {
    const archetypeDesc: { [key: string]: string } = {
      fit_girl: "athletic female, yoga/fitness enthusiast, confident, diverse ethnicity, gym wear",
      gym_bro: "athletic male, muscular build, gym enthusiast, confident, casual sportswear",
      runner: "lean athletic person, running enthusiast, energetic, athletic wear",
      lifestyle: "fashionable person, casual lifestyle, confident, trendy casual clothing",
    };

    const desc = archetypeDesc[archetype] || archetypeDesc.lifestyle;

    const prompt = `Create a professional portrait of a content creator named "${name}". 
    Type: ${desc}
    Style: Modern, professional headshot/portrait for social media. Bright, well-lit, high quality.
    Background: Minimalist, clean white or neutral. Focus on authentic, relatable appearance.
    Resolution: Professional Instagram/TikTok quality.`;

    const response = await openai.images.generate({
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
