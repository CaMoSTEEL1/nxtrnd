import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="px-10 py-10 max-w-5xl">
      <div className="flex items-end justify-between gap-8 mb-10">
        <div>
          <p className="label-section mb-3">Step 2</p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Products
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--foreground-muted)" }}>
            Upload what your influencer will be showcasing.
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </Link>
      </div>

      <div
        className="rounded-xl p-8"
        style={{ border: "1px solid var(--border)", background: "var(--background-card)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          No products yet
        </p>
        <p className="mt-1 text-sm max-w-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
          Upload a product image — clothing, shoes, supplements, or equipment. Add a brand brief and target demographic. Claude uses this to generate your scripts.
        </p>
        <Link href="/products/new" className="mt-5 inline-block">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Add first product
          </Button>
        </Link>
      </div>
    </div>
  );
}
