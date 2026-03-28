import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewScriptPage() {
  return (
    <div className="px-10 py-10 max-w-xl">

      <Link
        href="/scripts"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-8 transition-opacity hover:opacity-60"
        style={{ color: "var(--foreground-muted)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Scripts
      </Link>

      <p className="label-section mb-3">Step 3 of 4</p>
      <h1
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Generate scripts
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
        Claude writes 3 script options — pain-point, lifestyle, and social proof angles. Each includes a hook, benefit statement, CTA, and exact timing for voiceover sync.
      </p>

      <form className="mt-10 space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="influencer" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Influencer persona
          </label>
          <select
            id="influencer"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="">Select influencer…</option>
          </select>
          <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
            No personas yet. <Link href="/influencers/new" className="underline" style={{ color: "var(--primary)" }}>Create one first →</Link>
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="product" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Product
          </label>
          <select
            id="product"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="">Select product…</option>
          </select>
          <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
            No products yet. <Link href="/products/new" className="underline" style={{ color: "var(--primary)" }}>Upload one first →</Link>
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="extra-context" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Extra context <span className="font-normal" style={{ color: "var(--foreground-muted)" }}>(optional)</span>
          </label>
          <textarea
            id="extra-context"
            rows={3}
            placeholder="e.g. Emphasise the limited colourway drop. Avoid mentioning competitor brands."
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)] resize-none"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="lg">
            Generate 3 scripts
          </Button>
          <Link href="/scripts">
            <Button variant="ghost" size="lg">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
