import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewInfluencerPage() {
  return (
    <div className="px-10 py-10 max-w-xl">

      {/* Back */}
      <Link
        href="/influencers"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-8 transition-opacity hover:opacity-60"
        style={{ color: "var(--foreground-muted)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Influencers
      </Link>

      {/* Header */}
      <p className="label-section mb-3">Step 1 of 4</p>
      <h1
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Create AI influencer
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
        Claude + DALL-E 3 will generate a consistent persona — name, face, and style — from your brand brief.
      </p>

      {/* Form — not wrapped in a card */}
      <form className="mt-10 space-y-6">
        <div className="space-y-1.5">
          <label
            htmlFor="brand"
            className="block text-[13px] font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Brand name
          </label>
          <input
            id="brand"
            type="text"
            placeholder="e.g. Lululemon"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="sport"
            className="block text-[13px] font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Sport / category
          </label>
          <input
            id="sport"
            type="text"
            placeholder="e.g. yoga, running, supplements"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="demographic"
            className="block text-[13px] font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Target demographic
          </label>
          <select
            id="demographic"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="">Select…</option>
            <option value="gym-bros">Gym bros</option>
            <option value="fit-girls">Fit girls</option>
            <option value="runners">Runners</option>
            <option value="lifestyle">Lifestyle / athleisure</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="tone"
            className="block text-[13px] font-semibold"
            style={{ color: "var(--foreground)" }}
          >
            Brand tone
          </label>
          <select
            id="tone"
            className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
            style={{
              background: "var(--background-card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="">Select…</option>
            <option value="casual">Casual</option>
            <option value="professional">Professional</option>
            <option value="hype">Hype / high-energy</option>
            <option value="educational">Educational</option>
          </select>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="lg">
            Generate persona
          </Button>
          <Link href="/influencers">
            <Button variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
