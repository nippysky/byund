// components/landing/Pricing.tsx
"use client";

import { motion } from "framer-motion";

const STANDARD_FEE = "1.25%";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="bg-background py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-white px-4 py-8 shadow-sm md:px-8 md:py-10 lg:px-10 lg:py-12"
        >
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
            {/* Left: headline + bullets */}
            <div className="space-y-4 md:space-y-5">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                Pricing
              </p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                One transparent fee on every successful payment.
              </h2>
              <p className="max-w-lg text-sm text-muted md:text-base">
                BYUND doesn&apos;t charge setup or monthly software fees. You&apos;re
                only billed when you actually get paid, so costs scale with your
                revenue, not your ambition.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-muted md:text-[15px]">
                <li>• No setup, no minimums, no monthly subscription.</li>
                <li>• Pay a single percentage on successful payments.</li>
                <li>• Underlying payment network fees are passed through transparently.</li>
                <li>• Volume-based discounts as your flows grow.</li>
              </ul>

              <p className="pt-3 text-[11px] text-muted">
                Early teams and design partners can receive reduced fees while we
                learn together and shape the roadmap.
              </p>
            </div>

            {/* Right: fee card + example */}
            <div className="space-y-4 md:space-y-5">
              {/* Main fee pill */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface px-4 py-5 md:px-5 md:py-6">
                <div className="pointer-events-none absolute inset-x-0 -top-10 h-20 bg-linear-to-r from-accent/10 via-accent/0 to-accent/10 blur-2xl" />
                <div className="relative flex items-end justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                      Standard fee
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tracking-tight md:text-4xl">
                        {STANDARD_FEE}
                      </span>
                      <span className="text-xs text-muted md:text-sm">
                        per successful payment
                      </span>
                    </div>
                    <p className="text-xs text-muted md:text-[13px]">
                      Applied only when a payment completes. No extras, no hidden
                      platform charges.
                    </p>
                  </div>

                  <div className="inline-flex flex-col items-end gap-1 rounded-xl bg-white px-3 py-2 text-right text-[11px] shadow-sm">
                    <span className="font-medium text-foreground/80">
                      Volume pricing
                    </span>
                    <span className="text-muted">
                      Talk to us once you&apos;re
                      <br />
                      processing serious volume.
                    </span>
                  </div>
                </div>
              </div>

              {/* Example breakdown */}
              <div className="rounded-2xl border border-border bg-white px-4 py-4 md:px-5 md:py-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                  How a $1,000 payment looks
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Payment amount</span>
                    <span className="font-semibold">$1,000.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted md:text-[13px]">
                    <span>BYUND fee ({STANDARD_FEE})</span>
                    <span>$12.50</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted md:text-[13px]">
                    <span>Payment network fee (approx.)</span>
                    <span>$0.10–$0.50</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                    <span className="text-sm font-medium">You receive</span>
                    <span className="text-sm font-semibold">
                      ~$987.00+
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted">
                Figures above are illustrative. Exact fees depend on your volume,
                geography, and use case, but the model stays the same: a single,
                simple percentage on successful payments.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
