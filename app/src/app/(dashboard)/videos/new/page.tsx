"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Sparkles, Video, Download, Share2 } from "lucide-react";
import Link from "next/link";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_INFLUENCERS = [
  { id: "ava", name: "Ava Chen (@ava.moves)" },
  { id: "marcus", name: "Marcus Reid (@marcuslifts)" },
  { id: "priya", name: "Priya Nair (@runwithpriya)" },
  { id: "jordan", name: "Jordan Ellis (@jordo.daily)" },
];

const MOCK_SCRIPTS = [
  { id: "pain", name: "Pain-point — \"If your leggings are distracting you…\"" },
  { id: "lifestyle", name: "Lifestyle — \"This is what 6am looks like…\"" },
  { id: "social", name: "Social proof — \"I've tried 11 leggings…\"" },
];

const MOCK_PRODUCTS = [
  { id: "align", name: "Lululemon Align Pant" },
  { id: "define", name: "Lululemon Define Jacket" },
  { id: "swiftly", name: "Lululemon Swiftly Tech Racerback" },
  { id: "abc", name: "Lululemon ABC Pant" },
];

const CAPTION_STYLES = ["Bold", "Minimal", "None"] as const;
type CaptionStyle = typeof CAPTION_STYLES[number];
type Status = "idle" | "rendering" | "success";

// ── Render progress steps ─────────────────────────────────────────────────────
const RENDER_STEPS = [
  "Generating persona footage with DALL-E 3…",
  "Compositing product shots…",
  "Syncing voiceover with scene timing…",
  "Burning captions…",
  "Encoding H.264 at 9:16…",
  "Finalising 30-second reel…",
];

export default function NewVideoPage() {
  const [vInfluencer, setVInfluencer] = useState("");
  const [vScript, setVScript] = useState("");
  const [vProduct, setVProduct] = useState("");
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>("Bold");
  const [status, setStatus] = useState<Status>("idle");
  const [renderStep, setRenderStep] = useState(0);
  const [error, setError] = useState("");

  const hasInfluencers = MOCK_INFLUENCERS.length > 0;
  const hasScripts = MOCK_SCRIPTS.length > 0;
  const hasProducts = MOCK_PRODUCTS.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!vInfluencer) { setError("Please select an influencer persona."); return; }
    if (!vScript) { setError("Please select a script."); return; }
    if (!vProduct) { setError("Please select a product."); return; }

    setStatus("rendering");
    setRenderStep(0);

    try {
      // 1. Production-ready API integration (calls the backend stub)
      const res = await fetch("/api/videos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ influencerId: vInfluencer, scriptId: vScript, productId: vProduct }),
      });

      if (!res.ok) throw new Error("Failed to start generation job");

      // 2. Simulate polling progress for the UI
      for (let i = 0; i < RENDER_STEPS.length; i++) {
        setRenderStep(i);
        // Simulate arbitrary processing time for each step
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));
      }

      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setStatus("idle");
    }
  }

  const chosenInfluencer = MOCK_INFLUENCERS.find((x) => x.id === vInfluencer);
  const chosenScript = MOCK_SCRIPTS.find((x) => x.id === vScript);
  const chosenProduct = MOCK_PRODUCTS.find((x) => x.id === vProduct);

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="px-10 py-10 max-w-xl">
        <p className="label-section mb-3">Step 4 of 4 — Complete</p>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="h-6 w-6" style={{ color: "var(--primary)" }} />
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
            Video rendered!
          </h1>
        </div>

        {/* Video preview placeholder */}
        <div
          className="rounded-xl overflow-hidden mb-6 relative"
          style={{ background: "var(--background-card)", border: "1.5px solid var(--primary)" }}
        >
          {/* 9:16 aspect ratio container */}
          <div
            className="mx-auto overflow-hidden relative"
            style={{
              width: "200px",
              aspectRatio: "9/16",
              borderRadius: "10px",
              margin: "24px auto",
              background: "var(--background)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Simulated reel frame — clean editorial style */}
            <div className="absolute inset-0 flex flex-col">
              {/* Image area — neutral placeholder with subtle texture */}
              <div
                className="flex-1 flex items-center justify-center relative"
                style={{ background: "var(--primary-subtle)" }}
              >
                {/* Avatar initial */}
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: "var(--background-card)", color: "var(--primary)", border: "1px solid var(--border)" }}
                >
                  {chosenInfluencer?.name.charAt(0) ?? "A"}
                </div>
                {/* Play button — minimal */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.04)" }}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ background: "var(--foreground)", opacity: 0.85 }}
                  >
                    <Video className="h-4 w-4" style={{ color: "var(--background)" }} />
                  </div>
                </div>
              </div>

              {/* Caption strip */}
              <div
                className="px-3 py-2.5 flex-shrink-0"
                style={{ background: "var(--background-card)", borderTop: "1px solid var(--border)" }}
              >
                <div
                  className="h-1.5 rounded-full w-4/5 mb-1.5"
                  style={{ background: "var(--foreground)", opacity: 0.12 }}
                />
                <div
                  className="h-1.5 rounded-full w-3/5"
                  style={{ background: "var(--foreground)", opacity: 0.07 }}
                />
                <p className="mt-2 text-[8px] font-semibold uppercase tracking-widest" style={{ color: "var(--foreground-muted)" }}>
                  0:30 · 9:16
                </p>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div>
              <p className="text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
                {chosenProduct?.name ?? "Lululemon product"} — {chosenScript?.name.split(" — ")[0]} reel
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                ft. {chosenInfluencer?.name} · Captions: {captionStyle}
              </p>
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
            >
              Ready
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mb-6">
          <Button size="lg">
            <Download className="h-4 w-4" />
            Download MP4
          </Button>
          <Button variant="secondary" size="lg">
            <Share2 className="h-4 w-4" />
            Share link
          </Button>
        </div>

        {/* Campaign complete message */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: "var(--primary-subtle)", border: "1px solid var(--border)" }}
        >
          <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Campaign complete
          </p>
          <p className="text-[12px] mb-3" style={{ color: "var(--foreground-muted)" }}>
            Your first Lululemon AI influencer reel is ready to publish. Start a new campaign or tweak your persona and re-render.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to dashboard
              </Button>
            </Link>
            <button
              onClick={() => { setStatus("idle"); setVInfluencer(""); setVScript(""); setVProduct(""); }}
              className="text-[12px] transition-colors hover:text-[var(--foreground)]"
              style={{ color: "var(--foreground-muted)" }}
            >
              Render another →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Rendering progress state ───────────────────────────────────────────────
  if (status === "rendering") {
    const progress = Math.round(((renderStep + 1) / RENDER_STEPS.length) * 100);
    return (
      <div className="px-10 py-10 max-w-xl">
        <p className="label-section mb-3">Step 4 of 4</p>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: "var(--foreground)" }}>
          Rendering your video…
        </h1>
        <p className="text-[14px] mb-8" style={{ color: "var(--foreground-muted)" }}>
          This typically takes under 2 minutes. Don&apos;t close this tab.
        </p>

        <div
          className="rounded-xl p-6"
          style={{ background: "var(--background-card)", border: "1px solid var(--border)" }}
        >
          {/* Progress bar */}
          <div
            className="h-2 rounded-full mb-5 overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "var(--primary)" }}
            />
          </div>

          <p className="text-[14px] font-semibold mb-4" style={{ color: "var(--foreground)" }}>
            {progress}% complete
          </p>

          {/* Steps list */}
          <div className="space-y-2.5">
            {RENDER_STEPS.map((step, i) => {
              const done = i < renderStep;
              const active = i === renderStep;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <div
                    className="h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: done ? "var(--primary)" : active ? "var(--primary-subtle)" : "transparent",
                      border: done ? "none" : `2px solid ${active ? "var(--primary)" : "var(--border)"}`,
                    }}
                  >
                    {done && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    {active && (
                      <Sparkles
                        className="h-3 w-3 animate-pulse"
                        style={{ color: "var(--primary)" }}
                      />
                    )}
                  </div>
                  <p
                    className="text-[12px]"
                    style={{
                      color: done ? "var(--foreground-muted)" : active ? "var(--foreground)" : "var(--foreground-muted)",
                      opacity: done || active ? 1 : 0.4,
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <div className="px-10 py-10 max-w-xl">

      <Link
        href="/videos"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-8 transition-colors hover:text-[var(--foreground)]"
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

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>

        {/* Influencer */}
        <div className="space-y-1.5">
          <label htmlFor="v-influencer" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Influencer persona
          </label>
          {hasInfluencers ? (
            <select
              id="v-influencer"
              value={vInfluencer}
              onChange={(e) => setVInfluencer(e.target.value)}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="">Select influencer…</option>
              {MOCK_INFLUENCERS.map((inf) => (
                <option key={inf.id} value={inf.id}>{inf.name}</option>
              ))}
            </select>
          ) : (
            <div
              className="rounded-lg border px-3.5 py-3 text-[13px]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
            >
              No personas yet.{" "}
              <Link href="/influencers/new" className="underline font-semibold" style={{ color: "var(--primary)" }}>
                Create one first →
              </Link>
            </div>
          )}
        </div>

        {/* Script */}
        <div className="space-y-1.5">
          <label htmlFor="v-script" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Script
          </label>
          {hasScripts ? (
            <select
              id="v-script"
              value={vScript}
              onChange={(e) => setVScript(e.target.value)}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="">Select script…</option>
              {MOCK_SCRIPTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          ) : (
            <div
              className="rounded-lg border px-3.5 py-3 text-[13px]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
            >
              No scripts yet.{" "}
              <Link href="/scripts/new" className="underline font-semibold" style={{ color: "var(--primary)" }}>
                Generate scripts first →
              </Link>
            </div>
          )}
        </div>

        {/* Product */}
        <div className="space-y-1.5">
          <label htmlFor="v-product" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Product
          </label>
          {hasProducts ? (
            <select
              id="v-product"
              value={vProduct}
              onChange={(e) => setVProduct(e.target.value)}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="">Select product…</option>
              {MOCK_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>{prod.name}</option>
              ))}
            </select>
          ) : (
            <div
              className="rounded-lg border px-3.5 py-3 text-[13px]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground-muted)" }}
            >
              No products yet.{" "}
              <Link href="/products/new" className="underline font-semibold" style={{ color: "var(--primary)" }}>
                Upload one first →
              </Link>
            </div>
          )}
        </div>

        {/* Caption style — with working selection state */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
            Caption style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CAPTION_STYLES.map((style) => {
              const isActive = captionStyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => setCaptionStyle(style)}
                  className="flex items-center justify-center rounded-lg border px-3 py-2.5 text-[13px] font-medium cursor-pointer transition-colors"
                  style={{
                    borderColor: isActive ? "var(--primary)" : "var(--border)",
                    background: isActive ? "var(--primary-subtle)" : "var(--background-card)",
                    color: isActive ? "var(--primary)" : "var(--foreground-muted)",
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-[13px] font-medium" style={{ color: "var(--destructive)" }}>
            {error}
          </p>
        )}

        <div className="pt-2 flex items-center gap-3">
          <Button type="submit" size="lg">
            <Video className="h-4 w-4" />
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
