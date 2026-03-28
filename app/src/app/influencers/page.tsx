import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function InfluencersPage() {
  return (
    <div className="px-10 py-10 max-w-5xl">
      <div className="flex items-end justify-between gap-8 mb-10">
        <div>
          <p className="label-section mb-3">Step 1</p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Influencers
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--foreground-muted)" }}>
            Your AI persona library — one persona, infinite videos.
          </p>
        </div>
        <Link href="/influencers/new">
          <Button>
            <Plus className="h-4 w-4" />
            New persona
          </Button>
        </Link>
      </div>

      {/* Left-aligned empty state — not centered */}
      <div
        className="rounded-xl p-8"
        style={{ border: "1px solid var(--border)", background: "var(--background-card)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          No personas yet
        </p>
        <p className="mt-1 text-sm max-w-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
          Each persona is generated once with DALL-E 3 and reused across every video — consistent face, style, and voice.
        </p>
        <Link href="/influencers/new" className="mt-5 inline-block">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Create first persona
          </Button>
        </Link>
      </div>
    </div>
  );
}
