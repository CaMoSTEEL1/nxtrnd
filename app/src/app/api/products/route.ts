import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-client";

// GET /api/products
export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ products: [], count: 0 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, description, brand, image_url")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching products:", error);
      return NextResponse.json({ products: [], count: 0 });
    }

    const products = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      brand: row.brand,
      imageUrl: row.image_url || null,
    }));

    return NextResponse.json({ products, count: products.length });
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ products: [], count: 0 });
  }
}
