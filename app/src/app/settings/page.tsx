import { Button } from "@/components/ui/button";

const API_KEYS = [
  { id: "anthropic", label: "Anthropic API Key", hint: "Claude script & visual direction chains", placeholder: "sk-ant-…" },
  { id: "openai",    label: "OpenAI API Key",     hint: "DALL-E 3 persona and product images",     placeholder: "sk-…" },
  { id: "elevenlabs",label: "ElevenLabs API Key", hint: "Voiceover synthesis",                     placeholder: "…" },
  { id: "replicate", label: "Replicate API Token", hint: "ComfyUI image-to-video (optional)",      placeholder: "r8_…" },
];

export default function SettingsPage() {
  return (
    <div className="px-10 py-10 max-w-xl">
      <p className="label-section mb-3">Configuration</p>
      <h1
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: "var(--foreground)" }}
      >
        Settings
      </h1>
      <p className="mt-2 text-[15px]" style={{ color: "var(--foreground-muted)" }}>
        API keys are stored locally and never sent to any server except the respective providers.
      </p>

      <form className="mt-10 space-y-6">
        {API_KEYS.map(({ id, label, hint, placeholder }) => (
          <div key={id} className="space-y-1.5">
            <label
              htmlFor={id}
              className="block text-[13px] font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {label}
            </label>
            <p className="text-[11px]" style={{ color: "var(--foreground-muted)" }}>{hint}</p>
            <input
              id={id}
              type="password"
              placeholder={placeholder}
              className="w-full rounded-lg border px-3.5 py-2.5 text-sm font-mono outline-none transition-shadow focus:ring-2 focus:ring-[var(--primary-ring)]"
              style={{
                background: "var(--background-card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        ))}

        <div className="pt-2">
          <Button type="submit" size="lg">
            Save keys
          </Button>
        </div>
      </form>
    </div>
  );
}
