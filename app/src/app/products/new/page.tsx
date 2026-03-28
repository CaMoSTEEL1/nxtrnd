import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="px-10 py-10 max-w-xl">

      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-8 transition-opacity hover:opacity-60"
        style={{ color: "var(--foreground-muted)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Products
      </Link>

      <p className="label-section mb-3">Step 2 of 4</p>
      <h1
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Upload product
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
        Upload a product image and fill in the brand brief. Claude uses this to generate your scripts.
      </p>

      <form className="mt-10 space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="product-name" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Product name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="e.g. Nike Air Zoom Pegasus 41"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="product-image" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Product image
          </label>
          <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
            PNG or JPG, min 512×512px. Used for DALL-E 3 product showcase generation.
          </p>
          <div
            className="w-full rounded-lg border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)]"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-[13px] font-medium" style={{ color: "var(--foreground-muted)" }}>
              Drop image here or click to browse
            </p>
            <input id="product-image" type="file" accept="image/*" className="hidden" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="key-benefit" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Key benefit
          </label>
          <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
            The one thing this product does better than anything else.
          </p>
          <input
            id="key-benefit"
            type="text"
            placeholder="e.g. Reduces knee pain on long runs with ZoomX foam"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="price" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Price point
          </label>
          <input
            id="price"
            type="text"
            placeholder="e.g. $160"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="lg">
            Save product
          </Button>
          <Link href="/products">
            <Button variant="ghost" size="lg">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
