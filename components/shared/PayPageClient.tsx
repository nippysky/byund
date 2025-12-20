// components/shared/PayPageClient.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export type PayPageLink = {
  publicId: string;

  merchantName: string;
  linkName: string;
  description: string | null;

  currency: "USD";
  mode: "fixed" | "variable";
  fixedAmountCents: number | null;

  brandBg: string;
  brandText: string;

  // ✅ so we can show a branded "unavailable" state instead of 404
  isActive: boolean;
};

type Props = {
  link: PayPageLink;
  currentYear: number;
};

const MAX_USD_CENTS = 10_000_000_00;

// ✅ BYUND defaults
const BYUND_BLUE = "#0066ff";
const BYUND_WHITE = "#ffffff";

function isHexColor(s: unknown): s is string {
  if (typeof s !== "string") return false;
  return /^#([0-9a-fA-F]{6})$/.test(s.trim());
}

function normalizeMoneyInput(raw: string): string {
  let cleaned = raw.replace(/[^\d.]/g, "");
  const firstDotIndex = cleaned.indexOf(".");
  if (firstDotIndex !== -1) {
    const before = cleaned.slice(0, firstDotIndex + 1);
    const after = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
    cleaned = before + after;
  }
  if (cleaned === ".") return "0.";

  const [rawInt = "", rawDec] = cleaned.split(".");
  let intPart = rawInt.replace(/^0+(?=\d)/, "");
  if (intPart === "") intPart = rawDec !== undefined ? "0" : "";
  if (rawDec === undefined) return intPart;

  const decPart = rawDec.slice(0, 2);
  if (decPart === "") return intPart + ".";
  return `${intPart}.${decPart}`;
}

function usdCentsToPretty(cents: number) {
  const n = cents / 100;
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function safeUsdToCents(input: string): { cents: number | null; reason?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { cents: null };

  const normalized = trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return { cents: null, reason: "Enter a valid amount." };

  const [dollarsStr, centsStr = ""] = normalized.split(".");
  const dollars = Number(dollarsStr);
  if (!Number.isFinite(dollars)) return { cents: null, reason: "Enter a valid amount." };

  const cents = Number((centsStr + "00").slice(0, 2));
  const total = dollars * 100 + cents;

  if (!Number.isFinite(total) || total <= 0) return { cents: null, reason: "Amount must be greater than 0." };
  if (total > MAX_USD_CENTS) return { cents: null, reason: `Max amount is USD ${usdCentsToPretty(MAX_USD_CENTS)}.` };

  return { cents: Math.round(total) };
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function contrastRatio(a: string, b: string) {
  const L1 = luminance(a);
  const L2 = luminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * ✅ Brand resolution:
 * - default BYUND blue/white
 * - merchant overrides only if valid hex
 * - enforce legible text on chosen background
 */
function resolveBrand(brandBg: unknown, brandText: unknown) {
  const bg = isHexColor(brandBg) ? brandBg : BYUND_BLUE;
  const textRaw = isHexColor(brandText) ? brandText : BYUND_WHITE;

  const cr = contrastRatio(bg, textRaw);
  const text =
    cr >= 3.5
      ? textRaw
      : contrastRatio(bg, "#ffffff") >= contrastRatio(bg, "#0b1220")
      ? "#ffffff"
      : "#0b1220";

  const isTextLight = contrastRatio(bg, "#ffffff") > contrastRatio(bg, "#0b1220");
  return { bg, text, isTextLight };
}

export default function PayPageClient({ link, currentYear }: Props) {
  const [variableAmount, setVariableAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const brand = useMemo(
    () => resolveBrand(link.brandBg, link.brandText),
    [link.brandBg, link.brandText]
  );

  const isVariable = link.mode === "variable";

  const amountState = useMemo(() => {
    if (!isVariable) {
      const cents = link.fixedAmountCents ?? null;
      if (cents && cents > MAX_USD_CENTS) return { cents: null, reason: "Amount exceeds max allowed." };
      return { cents };
    }
    return safeUsdToCents(variableAmount);
  }, [isVariable, variableAmount, link.fixedAmountCents]);

  const amountCents = amountState.cents;
  const hasValidAmount = typeof amountCents === "number" && amountCents > 0;
  const canSubmit = hasValidAmount && !isSubmitting;

  const amountPretty = hasValidAmount ? usdCentsToPretty(amountCents!) : "0.00";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasValidAmount || !amountCents) return;

    setIsSubmitting(true);
    try {
      // TODO: call your checkout/session API
      await new Promise((r) => setTimeout(r, 650));
    } finally {
      setIsSubmitting(false);
    }
  }

  // subtle pill styling for either light/dark brand
  const pillStyle = brand.isTextLight
    ? {
        backgroundColor: "rgba(255,255,255,0.16)",
        borderColor: "rgba(255,255,255,0.22)",
        color: "rgba(255,255,255,0.92)",
      }
    : {
        backgroundColor: "rgba(0,0,0,0.08)",
        borderColor: "rgba(0,0,0,0.12)",
        color: "rgba(0,0,0,0.78)",
      };

  // ✅ Branded "unavailable" state for inactive links (instead of generic 404)
  if (!link.isActive) {
    return (
      <div className="min-h-screen bg-white">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
          {/* LEFT: brand panel */}
          <section
            className="relative flex min-h-[44vh] flex-col overflow-hidden p-6 lg:min-h-screen lg:p-10"
            style={{ backgroundColor: brand.bg, color: brand.text }}
          >
            {/* micro grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: 0.22,
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                backgroundPosition: "center",
              }}
            />
            {/* bloom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: 0.22,
                background:
                  "radial-gradient(900px 700px at 22% 30%, rgba(255,255,255,0.32), transparent 60%), radial-gradient(700px 520px at 72% 68%, rgba(0,0,0,0.18), transparent 55%)",
              }}
            />

            <div className="relative flex flex-1 flex-col justify-center">
              <div className="mx-auto w-full max-w-xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="leading-tight">
                    <p className="text-[11px] uppercase tracking-[0.22em] opacity-75">Payment to</p>
                    <p className="text-[18px] font-semibold tracking-[-0.03em]">{link.merchantName}</p>
                  </div>

                  <span
                    className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur"
                    style={pillStyle}
                  >
                    USDC on Base
                  </span>
                </div>

                <div className="mt-10">
                  <p className="text-[12px] uppercase tracking-[0.22em] opacity-75">For</p>
                  <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] lg:text-[34px]">
                    {link.linkName}
                  </h1>

                  {link.description ? (
                    <p className="mt-3 text-[13px] opacity-85 lg:text-[14px]">{link.description}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: message card */}
          <section className="flex min-h-[56vh] flex-col items-center justify-center bg-white p-6 lg:min-h-screen lg:p-10">
            <div className="w-full max-w-md">
              <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_16px_50px_rgba(15,17,21,0.07)] lg:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Link unavailable
                </p>

                <h2 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-foreground">
                  This payment link isn’t accepting payments right now.
                </h2>

                <p className="mt-2 text-[13px] text-muted">
                  Ask {link.merchantName} for an updated link, or try again later.
                </p>

                <div className="mt-5 flex flex-col gap-2">
                  <Button
                    className="w-full justify-center rounded-2xl py-3.5 text-[13px] font-semibold"
                    style={{ backgroundColor: brand.bg, color: brand.text }}
                    onClick={() => {
                      if (typeof window !== "undefined") window.location.reload();
                    }}
                  >
                    Refresh
                  </Button>

                  <Link href="/" className="w-full">
                    <Button variant="secondary" className="w-full justify-center">
                      Return to BYUND
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3 text-[11px] text-muted">
                <span>
                  Powered by <span className="font-semibold text-foreground">BYUND</span>
                </span>
                <span className="opacity-40">•</span>
                <Link href="/privacy" className="hover:text-foreground hover:underline">
                  Privacy
                </Link>
                <span className="opacity-40">•</span>
                <span>© {currentYear} BYUND</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT: brand panel */}
        <section
          className="relative flex min-h-[44vh] flex-col overflow-hidden p-6 lg:min-h-screen lg:p-10"
          style={{ backgroundColor: brand.bg, color: brand.text }}
        >
          {/* micro grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.22,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              backgroundPosition: "center",
            }}
          />
          {/* bloom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.22,
              background:
                "radial-gradient(900px 700px at 22% 30%, rgba(255,255,255,0.32), transparent 60%), radial-gradient(700px 520px at 72% 68%, rgba(0,0,0,0.18), transparent 55%)",
            }}
          />

          <div className="relative flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-xl">
              <div className="flex items-center justify-between gap-4">
                <div className="leading-tight">
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-75">Payment to</p>
                  <p className="text-[18px] font-semibold tracking-[-0.03em]">{link.merchantName}</p>
                </div>

                <span
                  className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur"
                  style={pillStyle}
                >
                  USDC on Base
                </span>
              </div>

              <div className="mt-10">
                <p className="text-[12px] uppercase tracking-[0.22em] opacity-75">For</p>
                <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] lg:text-[34px]">
                  {link.linkName}
                </h1>

                {link.description ? (
                  <p className="mt-3 text-[13px] opacity-85 lg:text-[14px]">{link.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: checkout */}
        <section className="flex min-h-[56vh] flex-col items-center justify-center bg-white p-6 lg:min-h-screen lg:p-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_16px_50px_rgba(15,17,21,0.07)] lg:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Amount
              </p>

              {/* calm amount */}
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[12px] font-medium text-muted">USD</span>
                    <span className="truncate text-[22px] font-semibold tracking-[-0.02em] text-foreground [font-variant-numeric:tabular-nums] sm:text-[24px]">
                      {amountPretty}
                    </span>
                  </div>
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
                {isVariable ? (
                  <div className="space-y-1.5">
                    <label htmlFor="amount" className="text-xs font-medium text-foreground">
                      Enter amount
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-muted">
                        USD
                      </span>
                      <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        className="block w-full rounded-xl border border-border bg-white px-3 py-3 pl-12 text-base outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="0.00"
                        value={variableAmount}
                        onChange={(e) => setVariableAmount(normalizeMoneyInput(e.target.value))}
                      />
                    </div>

                    {amountState.reason ? (
                      <p className="text-[11px] text-[#ef4444]">{amountState.reason}</p>
                    ) : (
                      <p className="text-[11px] text-muted">
                        Max {link.currency} {usdCentsToPretty(MAX_USD_CENTS)}
                      </p>
                    )}
                  </div>
                ) : null}

                {!isVariable && amountState.reason ? (
                  <p className="text-[11px] text-[#ef4444]">{amountState.reason}</p>
                ) : null}

                {/* Pay button is the hero */}
                <Button
                  type="submit"
                  className="w-full justify-center rounded-2xl py-3.5 text-[13px] font-semibold shadow-[0_10px_28px_rgba(0,0,0,0.10)]"
                  disabled={!canSubmit}
                  style={{
                    backgroundColor: brand.bg,
                    color: brand.text,
                  }}
                >
                  {isSubmitting ? "Processing…" : "Pay now"}
                </Button>
              </form>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 text-[11px] text-muted">
              <span>
                Powered by <span className="font-semibold text-foreground">BYUND</span>
              </span>
              <span className="opacity-40">•</span>
              <Link href="/privacy" className="hover:text-foreground hover:underline">
                Privacy
              </Link>
              <span className="opacity-40">•</span>
              <span>© {currentYear} BYUND</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
