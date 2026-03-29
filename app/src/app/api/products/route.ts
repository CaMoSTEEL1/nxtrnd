import { NextRequest, NextResponse } from "next/server";

// GET /api/products
// Returns: { products: Product[] }

export async function GET(req: NextRequest) {
  try {
    // In production, fetch from Supabase
    // For now, return mock products
    const products = [
      {
        id: "align",
        name: "Lululemon Align Pant",
        description: "Buttery-soft Nulu fabric, 4-way stretch",
        brand: "Lululemon",
        imageUrl: "https://via.placeholder.com/500x500?text=Align+Pant",
      },
      {
        id: "define",
        name: "Lululemon Define Jacket",
        description: "Fitted design, perfect layering piece",
        brand: "Lululemon",
        imageUrl: "https://via.placeholder.com/500x500?text=Define+Jacket",
      },
      {
        id: "swiftly",
        name: "Lululemon Swiftly Tech Racerback",
        description: "Moisture-wicking athletic racerback",
        brand: "Lululemon",
        imageUrl: "https://via.placeholder.com/500x500?text=Swiftly+Racerback",
      },
    ];

    return NextResponse.json(
      {
        products,
        count: products.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
