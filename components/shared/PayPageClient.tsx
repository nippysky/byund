// app/pay/[id]/PayPageClient.tsx
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

  brandLeftBg: string;
  brandLeftFg: string;
  brandAccent: string;
};

type Props = {
  link: PayPageLink;
  currentYear: number;
};

const MAX_USD_CENTS = 10_000_000_00; // $10,000,000.00 (prevents insane UI overflow + safer limits)

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
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

export default function PayPageClient({ link, currentYear }: Props) {
  const [variableAmount, setVariableAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVariable = link.mode === "variable";

  const amountState = useMemo(() => {
    if (!isVariable) {
      const cents = link.fixedAmountCents ?? null;
      if (cents && cents > MAX_USD_CENTS) {
        return { cents: null, reason: `Amount exceeds max allowed.` };
      }
      return { cents };
    }
    return safeUsdToCents(variableAmount);
  }, [isVariable, variableAmount, link.fixedAmountCents]);

  const amountCents = amountState.cents;
  const hasValidAmount = typeof amountCents === "number" && amountCents > 0;

  const canSubmit = hasValidAmount && !isSubmitting;

  const bigAmount = hasValidAmount ? usdCentsToPretty(amountCents!) : "0.00";

  const initials = link.merchantName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasValidAmount || !amountCents) return;

    setIsSubmitting(true);
    try {
      // TODO: next step is create Payment + return checkout intent + open wallet
      console.log("Checkout submit:", {
        publicId: link.publicId,
        amountUsdCents: amountCents,
      });

      await new Promise((r) => setTimeout(r, 650));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT: merchant branded panel */}
        <section
          className="relative flex min-h-[46vh] flex-col p-6 lg:min-h-screen lg:p-10"
          style={{ backgroundColor: link.brandLeftBg, color: link.brandLeftFg }}
        >
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[13px] font-semibold"
                style={{ color: link.brandAccent }}
              >
                {initials}
              </div>
              <div className="leading-tight">
                <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                  Payment to
                </p>
                <p className="text-[18px] font-semibold tracking-[-0.03em]">
                  {link.merchantName}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-black/70">
              USDC • Base
            </span>
          </div>

          <div className="mt-10 max-w-xl">
            <p className="text-[12px] uppercase tracking-[0.22em] opacity-70">
              For
            </p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] lg:text-[34px]">
              {link.linkName}
            </h1>

            {/* ✅ Small, clean description only (no long explainer here) */}
            {link.description ? (
              <p className="mt-3 text-[13px] opacity-80 lg:text-[14px]">
                {link.description}
              </p>
            ) : null}
          </div>

          {/* Bottom bullet/meta (pinned to bottom) */}
          <div className="mt-auto pt-10">
            <ul className="space-y-2 text-[11px] opacity-75">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-black/25" />
                <span>
                  BYUND never holds your funds. Settlement is direct to the merchant wallet.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* RIGHT: centered checkout */}
        <section className="flex min-h-[54vh] flex-col items-center justify-center bg-white p-6 lg:min-h-screen lg:p-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_20px_60px_rgba(15,17,21,0.08)] lg:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Amount
              </p>

              {/* ✅ Safe, contained amount row */}
              <div className="mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-medium text-muted">USD</span>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <span className="block truncate text-[40px] font-semibold leading-none tracking-[-0.05em] [font-variant-numeric:tabular-nums] lg:text-[44px]">
                      {bigAmount}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-[12px] text-muted">
                  You’ll confirm an equivalent USDC payment on Base in your wallet.
                </p>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
                {isVariable ? (
                  <div className="space-y-1.5">
                    <label htmlFor="amount" className="text-xs font-medium text-foreground">
                      Amount in USD
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

                <Button type="submit" className="w-full justify-center" disabled={!canSubmit}>
                  {isSubmitting ? "Processing…" : "Pay now"}
                </Button>
              </form>
            </div>

            {/* ✅ Moved from inside card to bottom of section */}
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
