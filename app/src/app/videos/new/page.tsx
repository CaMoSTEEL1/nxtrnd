import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewVideoPage() {
  return (
    <div className="px-10 py-10 max-w-xl">

      <Link
        href="/videos"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-8 transition-opacity hover:opacity-60"
        style={{ color: "var(--foreground-muted)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Videos
      </Link>

      <p className="label-section mb-3">Step 4 of 4</p>
      <h1
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Render video
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
        Compose influencer video + product shots + voiceover + captions into a 9:16, H.264, 30-second reel. Typical generation time: under 2 minutes.
      </p>

      <form className="mt-10 space-y-6">
        <div className="space-y-1.5">
          <label htmlFor="v-influencer" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Influencer persona
          </label>
          <select
            id="v-influencer"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="">Select influencer…</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="v-script" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Script
          </label>
          <select
            id="v-script"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="">Select script…</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="v-product" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Product
          </label>
          <select
            id="v-product"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="">Select product…</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Caption style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Bold", "Minimal", "None"].map((style) => (
              <label
                key={style}
                className="flex items-center justify-center rounded-lg border px-3 py-2.5 text-[13px] font-medium cursor-pointer transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-subtle)]"
                style={{ borderColor: "var(--border)", color: "var(--foreground-muted)" }}
              >
                <input type="radio" name="caption-style" value={style.toLowerCase()} className="hidden" />
                {style}
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="lg">
            Render video
          </Button>
          <Link href="/videos">
            <Button variant="ghost" size="lg">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
