"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import Link from "next/link";

type Status = "idle" | "loading" | "success";

export default function NewProductPage() {
  const [productName, setProductName] = useState("");
  const [keyBenefit, setKeyBenefit] = useState("");
  const [price, setPrice] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function handleDropZoneClick() {
    fileInputRef.current?.click();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setFileName(file.name);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!productName.trim()) { setError("Please enter a product name."); return; }
    if (!keyBenefit.trim()) { setError("Please describe the key benefit."); return; }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="px-10 py-10 max-w-xl">
        <p className="label-section mb-3">Step 2 of 4 — Complete</p>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="h-6 w-6" style={{ color: "var(--primary)" }} />
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
            Product saved!
          </h1>
        </div>

        {/* Product summary card */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: "var(--background-card)", border: "1.5px solid var(--primary)" }}
        >
          <div className="flex items-start gap-4">
            {/* Image placeholder */}
            <div
              className="w-16 h-20 rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
            >
              <Upload className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold mb-1" style={{ color: "var(--foreground)" }}>{productName}</p>
              {price && (
                <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--primary)" }}>{price}</p>
              )}
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>{keyBenefit}</p>
              {fileName && (
                <p className="text-[11px] mt-2 truncate" style={{ color: "var(--foreground-muted)" }}>
                  Image: {fileName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Next step CTA */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: "var(--primary-subtle)", border: "1px solid var(--border)" }}
        >
          <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Next: generate scripts
          </p>
          <p className="text-[12px] mb-3" style={{ color: "var(--foreground-muted)" }}>
            Claude will write 3 script options — pain-point, lifestyle, and social proof — tailored to {productName}.
          </p>
          <Link href="/scripts/new">
            <Button size="lg">
              Generate scripts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <button
          onClick={() => { setStatus("idle"); }}
          className="text-[12px] transition-colors hover:text-[var(--foreground)]"
          style={{ color: "var(--foreground-muted)" }}
        >
          ← Upload a different product
        </button>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <div className="px-10 py-10 max-w-xl">

      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-8 transition-colors hover:text-[var(--foreground)]"
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

      {/* Loading state */}
      {status === "loading" && (
        <div
          className="mt-8 rounded-xl p-8"
          style={{ background: "var(--background-card)", border: "1px solid var(--border)" }}
        >
          <div
            className="h-1 rounded-full mb-7 overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                background: "var(--primary)",
                width: "40%",
                animation: "shimmer-bar 1.5s ease-in-out infinite",
              }}
            />
          </div>
          <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Saving product brief…
          </p>
          <p className="text-[13px]" style={{ color: "var(--foreground-muted)" }}>
            Processing image and indexing brief for Claude
          </p>
          <div className="mt-5 space-y-2">
            {["Processing product image", "Indexing brief for Claude"].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ background: i === 0 ? "var(--primary)" : "var(--border)" }}
                />
                <p className="text-[12px]" style={{ color: i === 0 ? "var(--foreground)" : "var(--foreground-muted)", opacity: i === 0 ? 1 : 0.5 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {status === "idle" && (
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="product-name" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
              Product name
            </label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Lululemon Align Pant"
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
              style={{ borderColor: fileName ? "var(--primary)" : "var(--border)", background: fileName ? "var(--primary-subtle)" : undefined }}
              onClick={handleDropZoneClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {fileName ? (
                <div>
                  <Upload className="h-5 w-5 mx-auto mb-2" style={{ color: "var(--primary)" }} />
                  <p className="text-[13px] font-medium" style={{ color: "var(--primary)" }}>{fileName}</p>
                  <p className="text-[11px] mt-1" style={{ color: "var(--foreground-muted)" }}>Click to replace</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-5 w-5 mx-auto mb-2" style={{ color: "var(--foreground-muted)" }} />
                  <p className="text-[13px] font-medium" style={{ color: "var(--foreground-muted)" }}>
                    Drop image here or click to browse
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="product-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
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
              value={keyBenefit}
              onChange={(e) => setKeyBenefit(e.target.value)}
              placeholder="e.g. Buttery-soft 4-way stretch that moves with every pose"
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="price" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
              Price point <span className="font-normal" style={{ color: "var(--foreground-muted)" }}>(optional)</span>
            </label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. $128"
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          {error && (
            <p className="text-[13px] font-medium" style={{ color: "var(--destructive)" }}>
              {error}
            </p>
          )}

          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" size="lg">
              Save product
            </Button>
            <Link href="/products">
              <Button variant="ghost" size="lg">Cancel</Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
