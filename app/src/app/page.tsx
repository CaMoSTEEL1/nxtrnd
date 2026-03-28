import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Package, FileText, Video, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────
const PIPELINE = [
  {
    num: 1,
    label: "Influencer",
    detail: "AI persona",
    count: 0,
    icon: Users,
    href: "/influencers/new",
    addLabel: "Create persona",
  },
  {
    num: 2,
    label: "Product",
    detail: "image + brief",
    count: 0,
    icon: Package,
    href: "/products/new",
    addLabel: "Upload product",
  },
  {
    num: 3,
    label: "Script",
    detail: "3 AI options",
    count: 0,
    icon: FileText,
    href: "/scripts/new",
    addLabel: "Generate scripts",
  },
  {
    num: 4,
    label: "Video",
    detail: "30-sec reel",
    count: 0,
    icon: Video,
    href: "/videos/new",
    addLabel: "Render video",
  },
];

// Ghost items that teach the user what the activity list looks like
const GHOST_ITEMS = [
  { label: "Lululemon — Fit girl persona", type: "Influencer", ago: "—" },
  { label: "Nike Air Zoom — Pain-point script", type: "Script", ago: "—" },
  { label: "Whey+ Supplement — 30-sec reel", type: "Video", ago: "—" },
];

// ─── Page ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const firstIncomplete = PIPELINE.find((s) => s.count === 0) ?? PIPELINE[0];

  return (
    <div className="min-h-screen px-10 py-10 max-w-5xl">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-8 mb-14">
        <div>
          <p className="label-section mb-3">UGC Studio</p>
          <h1
            className="text-4xl font-extrabold tracking-tight leading-[1.1]"
            style={{ color: "var(--foreground)" }}
          >
            Build your campaign.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed max-w-md" style={{ color: "var(--foreground-muted)" }}>
            Four steps from brief to TikTok-ready video.
            Claude writes the scripts. DALL-E builds the persona. You publish.
          </p>
        </div>
        <Link href="/videos/new" className="shrink-0">
          <Button size="lg">
            <Video className="h-4 w-4" />
            New video
          </Button>
        </Link>
      </div>

      {/* ── Pipeline ─────────────────────────────────────────── */}
      <section className="mb-14">
        <p className="label-section mb-6">Pipeline</p>

        {/* Step indicators with connectors */}
        <div className="grid grid-cols-4">
          {PIPELINE.map((step, i) => {
            const done = step.count > 0;
            return (
              <div key={step.num} className="flex flex-col">
                {/* Circle + line */}
                <div className="flex items-center">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors"
                    style={{
                      background: done ? "var(--primary)" : "var(--background-card)",
                      border: `2px solid ${done ? "var(--primary)" : "var(--border)"}`,
                      color: done ? "#fff" : "var(--foreground-muted)",
                    }}
                  >
                    {step.num}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div
                      className="flex-1 h-px"
                      style={{ background: "var(--border)" }}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="mt-4 pr-6">
                  <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                    {step.label}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                    {step.detail}
                  </p>
                  <p
                    className="mt-3 text-2xl font-extrabold tabular-nums"
                    style={{ color: done ? "var(--primary)" : "var(--foreground-muted)", opacity: done ? 1 : 0.4 }}
                  >
                    {step.count}
                  </p>
                  <Link
                    href={step.href}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold transition-all hover:gap-1.5"
                    style={{ color: "var(--primary)" }}
                  >
                    {step.addLabel}
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Next Action — single featured card ───────────────── */}
      <section className="mb-14">
        <p className="label-section mb-4">Next step</p>
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--primary-subtle)",
            border: "1.5px solid var(--primary)",
          }}
        >
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1 min-w-0">
              <Badge variant="default" className="mb-3">
                Step {firstIncomplete.num} of 4
              </Badge>
              <h2
                className="text-xl font-bold leading-snug"
                style={{ color: "var(--foreground)" }}
              >
                {firstIncomplete.num === 1 && "Create your AI influencer"}
                {firstIncomplete.num === 2 && "Upload your first product"}
                {firstIncomplete.num === 3 && "Generate scripts with Claude"}
                {firstIncomplete.num === 4 && "Render your first video"}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                {firstIncomplete.num === 1 &&
                  "Design a consistent AI persona — name, face, style, vibe — that will star across all your brand's videos. Takes 30 seconds."}
                {firstIncomplete.num === 2 &&
                  "Upload a product image and fill in the brand brief. This is what Claude will write scripts around."}
                {firstIncomplete.num === 3 &&
                  "Claude generates 3 script options: pain-point, lifestyle, and social proof angles. Pick one or mix them."}
                {firstIncomplete.num === 4 &&
                  "Compose your influencer video, voiceover, captions, and product shots into a 9:16 reel."}
              </p>
            </div>
            <Link href={firstIncomplete.href} className="shrink-0 mt-1">
              <Button size="lg">
                {firstIncomplete.addLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Remaining steps hint */}
          {firstIncomplete.num < 4 && (
            <div
              className="mt-5 pt-4 flex items-center gap-6"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span className="text-[11px] font-medium" style={{ color: "var(--foreground-muted)" }}>
                Then:
              </span>
              {PIPELINE.filter((s) => s.num > firstIncomplete.num).map((s) => (
                <span key={s.num} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--foreground-muted)" }}>
                  <span className="font-semibold" style={{ color: "var(--foreground)" }}>{s.num}.</span>
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Recent Work — teaching empty state ───────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="label-section">Recent work</p>
          <Link href="/videos">
            <button className="text-[11px] font-semibold transition-colors hover:opacity-70" style={{ color: "var(--primary)" }}>
              View all
            </button>
          </Link>
        </div>

        {/* Ghost rows — teach the interface */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {GHOST_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3.5"
              style={{
                background: "var(--background-card)",
                borderBottom: i < GHOST_ITEMS.length - 1 ? "1px solid var(--border)" : "none",
                opacity: 0.25,
                pointerEvents: "none",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail placeholder */}
                <div
                  className="h-9 w-7 rounded flex-shrink-0"
                  style={{
                    background: "var(--border)",
                    aspectRatio: "9/16",
                  }}
                />
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "var(--foreground)" }}>
                    {item.label}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                    {item.type}
                  </p>
                </div>
              </div>
              <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
                {item.ago}
              </p>
            </div>
          ))}

          {/* Caption below ghosts */}
          <div
            className="px-5 py-3.5"
            style={{
              background: "var(--background)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>
              Generated personas, scripts, and videos will appear here as you build your pipeline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
