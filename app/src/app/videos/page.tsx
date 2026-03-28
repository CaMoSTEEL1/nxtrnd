import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function VideosPage() {
  return (
    <div className="px-10 py-10 max-w-5xl">
      <div className="flex items-end justify-between gap-8 mb-10">
        <div>
          <p className="label-section mb-3">Step 4</p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Videos
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--foreground-muted)" }}>
            9:16 short-form reels, ready for TikTok and Instagram Reels.
          </p>
        </div>
        <Link href="/videos/new">
          <Button>
            <Plus className="h-4 w-4" />
            New video
          </Button>
        </Link>
      </div>

      {/* Grid placeholder — will become 9:16 thumbnail grid */}
      <div
        className="rounded-xl p-8"
        style={{ border: "1px solid var(--border)", background: "var(--background-card)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          No videos yet
        </p>
        <p className="mt-1 text-sm max-w-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
          Compose influencer video + product shots + AI voiceover + captions into a 30-second, H.264, 9:16 reel. Generation takes under two minutes.
        </p>
        <Link href="/videos/new" className="mt-5 inline-block">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Render first video
          </Button>
        </Link>
      </div>
    </div>
  );
}
