"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

// ── Mock persona results keyed by demographic ─────────────────────────────────
const PERSONA_RESULTS: Record<string, { name: string; handle: string; bio: string; imageHint: string }> = {
  "fit-girls": {
    name: "Ava Chen",
    handle: "@ava.moves",
    bio: "25-year-old yoga instructor based in Austin, TX. Radiates calm confidence. Posts sunrise flows, clean-girl aesthetics, and honest gear reviews. 2.1M followers across TikTok & Instagram.",
    imageHint: "Athletic woman, yoga studio, soft morning light, Lululemon Align set",
  },
  "gym-bros": {
    name: "Marcus Reid",
    handle: "@marcuslifts",
    bio: "28-year-old strength coach in LA. High-energy, no-nonsense, deeply knowledgeable. Posts PRs, mobility work, and supplement stacks. 1.8M followers who trust his picks.",
    imageHint: "Athletic man, modern gym, dramatic lighting, Lululemon ABC pants",
  },
  runners: {
    name: "Priya Nair",
    handle: "@runwithpriya",
    bio: "30-year-old marathon runner based in Chicago. Relatable, data-driven, warmly motivational. Documents training blocks, race-day hauls, and recovery routines. 940K followers.",
    imageHint: "Woman running on urban trail, golden hour, Lululemon Swiftly Tech",
  },
  lifestyle: {
    name: "Jordan Ellis",
    handle: "@jordo.daily",
    bio: "27-year-old content creator in NYC. Effortlessly cool athleisure aesthetic. Posts coffee runs, pilates classes, and weekend hauls. 3.4M TikTok followers.",
    imageHint: "Stylish person in city, athleisure outfit, Lululemon Define Jacket",
  },
};

const DEFAULT_PERSONA = PERSONA_RESULTS["fit-girls"];

type Status = "idle" | "loading" | "success";

export default function NewInfluencerPage() {
  const [brand, setBrand] = useState("");
  const [sport, setSport] = useState("");
  const [demographic, setDemographic] = useState("");
  const [tone, setTone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [persona, setPersona] = useState<typeof DEFAULT_PERSONA | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!brand.trim()) { setError("Please enter a brand name."); return; }
    if (!demographic) { setError("Please select a target demographic."); return; }
    if (!tone) { setError("Please select a brand tone."); return; }

    setStatus("loading");
    setTimeout(() => {
      const result = PERSONA_RESULTS[demographic] ?? DEFAULT_PERSONA;
      setPersona(result);
      setStatus("success");
    }, 2000);
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success" && persona) {
    return (
      <div className="px-10 py-10 max-w-xl">
        <p className="label-section mb-3">Step 1 of 4 — Complete</p>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="h-6 w-6" style={{ color: "var(--primary)" }} />
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
            Persona created!
          </h1>
        </div>

        {/* Persona card */}
        <div
          className="rounded-xl p-6 mb-6"
          style={{ background: "var(--background-card)", border: "1.5px solid var(--primary)" }}
        >
          {/* Avatar placeholder */}
          <div
            className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-bold"
            style={{ background: "var(--primary-subtle)", color: "var(--primary)" }}
          >
            {persona.name.charAt(0)}
          </div>

          <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{persona.name}</p>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--primary)" }}>{persona.handle}</p>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--foreground-muted)" }}>{persona.bio}</p>

          <div
            className="rounded-lg px-3.5 py-2.5 text-[11px] leading-relaxed"
            style={{ background: "var(--primary-subtle)", color: "var(--foreground-muted)" }}
          >
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>DALL-E prompt: </span>
            {persona.imageHint}
          </div>
        </div>

        {/* Next step CTA */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{ background: "var(--primary-subtle)", border: "1px solid var(--border)" }}
        >
          <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--foreground)" }}>
            Next: upload your product
          </p>
          <p className="text-[12px] mb-3" style={{ color: "var(--foreground-muted)" }}>
            Give Claude a product image and brief so it can write scripts tailored to {persona.name}&apos;s audience.
          </p>
          <Link href="/products/new">
            <Button size="lg">
              Upload product
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <button
          onClick={() => { setStatus("idle"); setPersona(null); }}
          className="text-[12px] transition-opacity hover:opacity-60"
          style={{ color: "var(--foreground-muted)" }}
        >
          ← Generate a different persona
        </button>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
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

      {/* Loading overlay */}
      {status === "loading" && (
        <div
          className="mt-8 rounded-xl p-8 text-center"
          style={{ background: "var(--background-card)", border: "1px solid var(--border)" }}
        >
          <div className="flex justify-center mb-4">
            <Sparkles className="h-8 w-8 animate-pulse" style={{ color: "var(--primary)" }} />
          </div>
          <p className="text-[15px] font-semibold" style={{ color: "var(--foreground)" }}>
            Claude is designing your persona…
          </p>
          <p className="text-[13px] mt-1.5" style={{ color: "var(--foreground-muted)" }}>
            Crafting name, backstory, aesthetic, and DALL-E visual prompt
          </p>
          <div className="mt-5 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full animate-bounce"
                style={{ background: "var(--primary)", animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      {status === "idle" && (
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="brand" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
              Brand name
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Lululemon"
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="sport" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
              Sport / category
            </label>
            <input
              id="sport"
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="e.g. yoga, running, supplements"
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="demographic" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
              Target demographic
            </label>
            <select
              id="demographic"
              value={demographic}
              onChange={(e) => setDemographic(e.target.value)}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="">Select…</option>
              <option value="gym-bros">Gym bros</option>
              <option value="fit-girls">Fit girls</option>
              <option value="runners">Runners</option>
              <option value="lifestyle">Lifestyle / athleisure</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tone" className="block text-[13px] font-semibold" style={{ color: "var(--foreground)" }}>
              Brand tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{ background: "var(--background-card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              <option value="">Select…</option>
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="hype">Hype / high-energy</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          {error && (
            <p className="text-[13px] font-medium" style={{ color: "var(--destructive)" }}>
              {error}
            </p>
          )}

          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" size="lg">
              <Sparkles className="h-4 w-4" />
              Generate persona
            </Button>
            <Link href="/influencers">
              <Button variant="ghost" size="lg">Cancel</Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
