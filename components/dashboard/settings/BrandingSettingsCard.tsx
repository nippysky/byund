"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function isHexColor(s: string) {
  return /^#([0-9a-fA-F]{6})$/.test(s.trim());
}

function normalizeHex(s: string) {
  const v = s.trim();
  if (!v) return v;
  if (v[0] !== "#") return `#${v}`.toUpperCase();
  return v.toUpperCase();
}

// Contrast helpers (WCAG-ish)
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function srgbToLinear(x: number) {
  const v = x / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(bg: string, fg: string) {
  const L1 = luminance(bg);
  const L2 = luminance(fg);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

function ColorField({
  label,
  help,
  value,
  onChange,
  invalid,
}: {
  label: string;
  help: string;
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>

      <div className="flex items-center gap-2">
        {/* Color picker */}
        <input
          type="color"
          value={isHexColor(value) ? value : "#000000"}
          onChange={(e) => onChange(normalizeHex(e.target.value))}
          className="h-10 w-10 cursor-pointer rounded-xl border border-border bg-white p-0"
          aria-label={`${label} picker`}
        />

        {/* Hex input */}
        <input
          value={value}
          onChange={(e) => onChange(normalizeHex(e.target.value))}
          className="block w-full rounded-xl border border-border bg-white px-3 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
          placeholder="#RRGGBB"
          maxLength={7}
          inputMode="text"
          autoComplete="off"
        />
      </div>

      {invalid ? (
        <p className="text-[11px] text-[#ef4444]">Use a hex color like #1E6BFF</p>
      ) : (
        <p className="text-[11px] text-muted">{help}</p>
      )}
    </div>
  );
}

export default function BrandingSettingsCard({
  initial,
}: {
  initial: { brandBg: string; brandText: string };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [brandBg, setBrandBg] = useState(normalizeHex(initial.brandBg));
  const [brandText, setBrandText] = useState(normalizeHex(initial.brandText));
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => {
    return (
      normalizeHex(brandBg) !== normalizeHex(initial.brandBg) ||
      normalizeHex(brandText) !== normalizeHex(initial.brandText)
    );
  }, [brandBg, brandText, initial]);

  const valid = isHexColor(brandBg) && isHexColor(brandText);
  const canSave = dirty && valid && !saving;

  const ratio = useMemo(() => {
    if (!valid) return null;
    return contrastRatio(brandBg, brandText);
  }, [brandBg, brandText, valid]);

  const contrastOk = ratio == null ? true : ratio >= 4.5; // good default for normal text

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/settings/branding", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandBg: normalizeHex(brandBg),
          brandText: normalizeHex(brandText),
        }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");

      toast({ title: "Saved", variant: "success", message: "Branding updated." });
      router.refresh();
    } catch {
      toast({ title: "Update failed", variant: "error", message: "Try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_8px_25px_rgba(15,17,21,0.06)] md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[-0.01em]">Checkout branding</p>
          <p className="mt-1 text-sm text-muted">
            These two colors style the left panel of your checkout. Keep it readable—customers should
            instantly recognize your brand and still be able to read the details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setBrandBg(normalizeHex(initial.brandBg));
              setBrandText(normalizeHex(initial.brandText));
            }}
            disabled={saving || !dirty}
          >
            Reset
          </Button>

          <Button size="sm" onClick={onSave} disabled={!canSave}>
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ColorField
          label="Brand color"
          help="Used as the checkout left panel background."
          value={brandBg}
          onChange={setBrandBg}
          invalid={!isHexColor(brandBg)}
        />

        <ColorField
          label="Text color"
          help="Used for headings and text on the left panel."
          value={brandText}
          onChange={setBrandText}
          invalid={!isHexColor(brandText)}
        />
      </div>

      {/* Contrast warning */}
      {valid && !contrastOk ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-surface/50 p-3 text-[11px] text-muted">
          <TriangleAlert className="mt-0.5 h-4 w-4 text-muted" />
          <div>
            <p className="font-medium text-foreground">Low contrast</p>
            <p className="mt-0.5">
              Your text may be hard to read. Try a darker text color or lighter background.
              {ratio ? ` (Contrast: ${ratio.toFixed(2)}:1)` : null}
            </p>
          </div>
        </div>
      ) : null}

      {/* Preview */}
      <div
        className="mt-6 rounded-3xl border border-border p-6"
        style={{ background: valid ? brandBg : "#EAF2FF", color: valid ? brandText : "#0B1220" }}
      >
        <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.72 }}>
          Preview
        </p>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.72 }}>
              Payment to
            </p>
            <p className="mt-1 truncate text-[20px] font-semibold tracking-[-0.03em]">
              Your Business
            </p>
          </div>

          <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-black/70">
            USDC • Base
          </span>
        </div>

        <div className="mt-6 max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.72 }}>
            For
          </p>
          <p className="mt-1 text-[28px] font-semibold leading-tight tracking-[-0.04em]">
            Checkout Item Name
          </p>
          <p className="mt-2 text-[13px]" style={{ opacity: 0.8 }}>
            This is a short description. Keep it simple and readable.
          </p>
        </div>
      </div>
    </div>
  );
}
