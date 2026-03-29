import { NextRequest, NextResponse } from "next/server";
import { generateProductImage } from "@/lib/image-generator";

// POST /api/products/create
// Body: { name: string, description?: string, brand?: string }
// Returns: { product: { id, name, imageUrl, description, brand } }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description = "High-quality product", brand = "Brand" } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    // Generate product showcase image
    const imageUrl = await generateProductImage(
      name,
      description,
      "fitness and lifestyle enthusiasts"
    );

    // Create product object (in production, save to Supabase)
    const product = {
      id: `product-${Date.now()}`,
      name,
      description,
      brand,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        product,
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Product creation error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create product",
      },
      { status: 500 }
    );
  }
}
