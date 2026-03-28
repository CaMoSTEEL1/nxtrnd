import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ScriptsPage() {
  return (
    <div className="px-10 py-10 max-w-5xl">
      <div className="flex items-end justify-between gap-8 mb-10">
        <div>
          <p className="label-section mb-3">Step 3</p>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Scripts
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--foreground-muted)" }}>
            Claude writes three angles per product. You pick one.
          </p>
        </div>
        <Link href="/scripts/new">
          <Button>
            <Plus className="h-4 w-4" />
            Generate scripts
          </Button>
        </Link>
      </div>

      <div
        className="rounded-xl p-8"
        style={{ border: "1px solid var(--border)", background: "var(--background-card)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          No scripts yet
        </p>
        <p className="mt-1 text-sm max-w-sm leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
          Claude generates three script angles per product: pain-point solve, lifestyle/aspirational, and social proof. Each includes a hook, benefit statement, CTA, and exact timing for voiceover sync.
        </p>
        <Link href="/scripts/new" className="mt-5 inline-block">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            Generate first script
          </Button>
        </Link>
      </div>
    </div>
  );
}
