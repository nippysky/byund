// app/pay/[id]/PayPageClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export type PayPageLink = {
  id: string;
  merchantName: string;
  linkName: string;
  currency: "USD";           // for now
  mode: "fixed" | "variable";
  amount: string | null;     // required when mode === "fixed"
};

type PayPageClientProps = {
  link: PayPageLink;
  currentYear: number;
};

// Money input normalizer
function normalizeMoneyInput(raw: string): string {
  let cleaned = raw.replace(/[^\d.]/g, "");

  const firstDotIndex = cleaned.indexOf(".");
  if (firstDotIndex !== -1) {
    const before = cleaned.slice(0, firstDotIndex + 1);
    const after = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
    cleaned = before + after;
  }

  if (cleaned === ".") {
    return "0.";
  }

  const [rawInt = "", rawDec] = cleaned.split(".");

  let intPart = rawInt.replace(/^0+(?=\d)/, "");
  if (intPart === "") {
    intPart = rawDec !== undefined ? "0" : "";
  }

  if (rawDec === undefined) {
    return intPart;
  }

  const decPart = rawDec.slice(0, 2);
  if (decPart === "") {
    return intPart + ".";
  }

  return `${intPart}.${decPart}`;
}

function formatFixedAmount(currency: string, raw: string | null): string {
  if (!raw) return "";
  const n = Number(raw);
  if (Number.isNaN(n)) return `${currency} ${raw}`;
  return `${currency} ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PayPageClient({ link, currentYear }: PayPageClientProps) {
  const [variableAmount, setVariableAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isVariable = link.mode === "variable";

  const effectiveAmount = isVariable
    ? variableAmount
    : link.amount ?? "";

  const numeric = Number(
    effectiveAmount.endsWith(".")
      ? effectiveAmount.slice(0, -1)
      : effectiveAmount
  );

  const hasValidAmount =
    effectiveAmount.trim().length > 0 &&
    !Number.isNaN(numeric) &&
    numeric > 0;

  const canSubmit = hasValidAmount && !isSubmitting;

  const buttonLabel = hasValidAmount
    ? `Pay ${link.currency} ${numeric.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "Pay";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasValidAmount) return;

    setIsSubmitting(true);
    try {
      // TODO: hook into wallet + backend
      console.log("Submitting payment:", {
        linkId: link.id,
        amount: effectiveAmount,
        currency: link.currency,
      });
      await new Promise((resolve) => setTimeout(resolve, 700));
    } finally {
      setIsSubmitting(false);
    }
  }

  const formattedFixed = !isVariable
    ? formatFixedAmount(link.currency, link.amount)
    : null;

  const initials = link.merchantName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 md:px-6 md:py-10">
        {/* Top brand row */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-[18px] font-semibold tracking-[-0.04em]">
              {link.merchantName}
            </span>
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-foreground/80">
              USDC • Base
            </span>
          </div>
        </header>

        {/* Split layout */}
        <main className="flex flex-1 items-center">
          <div className="grid w-full gap-6 md:grid-cols-2 md:gap-8">
            {/* LEFT – merchant info on blue */}
            <section className="flex flex-col justify-between rounded-3xl bg-accent-soft px-5 py-6 shadow-[0_20px_60px_rgba(15,17,21,0.10)] md:px-7 md:py-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-accent shadow-sm">
                  {initials}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
                    Payment to
                  </p>
                  <p className="text-[16px] font-semibold tracking-[-0.03em]">
                    {link.merchantName}
                  </p>
                  <p className="text-[12px] text-muted">
                    {link.linkName}
                  </p>
                </div>
              </div>

              {/* Single simple explainer line */}
         <p className="mt-6 text-[11px] text-muted">
  Amount is shown in USD. You&apos;ll confirm an equivalent USDC payment
  on Base in your wallet.
</p>

            </section>

            {/* RIGHT – white checkout panel */}
            <section className="flex flex-col rounded-3xl border border-border bg-white px-5 py-6 shadow-[0_20px_60px_rgba(15,17,21,0.10)] md:px-7 md:py-8">
              <h1 className="text-[15px] font-semibold tracking-[-0.02em]">
                Checkout
              </h1>
              <p className="mt-1 text-[12px] text-muted">
                Review the amount and confirm in your wallet on Base.
              </p>

              <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
                {/* Amount – only place where amount is shown */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="amount"
                    className="text-xs font-medium text-foreground"
                  >
                    Amount in {link.currency}
                  </label>

                  {isVariable ? (
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-muted">
                        {link.currency}
                      </span>
                      <input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        className="block w-full rounded-lg border border-border bg-white px-3 py-3 pl-11 text-base outline-none ring-0 transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="0.00"
                        value={variableAmount}
                        onChange={(e) =>
                          setVariableAmount(
                            normalizeMoneyInput(e.target.value)
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border bg-surface px-3 py-3 text-base">
                      {formattedFixed}
                    </div>
                  )}
                </div>

                {/* Pay button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full justify-center"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Processing…" : buttonLabel}
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between text-[11px] text-muted">
          <span>© {currentYear} BYUND</span>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground hover:underline"
            >
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
