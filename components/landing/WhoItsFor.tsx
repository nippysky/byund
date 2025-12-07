// components/landing/WhoItsFor.tsx
"use client";

import { motion } from "framer-motion";

const segments = [
  {
    title: "SaaS & B2B platforms",
    body: "Charge globally in USD, settle into a single ledger, and connect payments to your existing billing or CRM without adding another bank provider.",
  },
  {
    title: "Marketplaces & platforms",
    body: "Handle incoming USD flows from buyers and settle to your platform or vendors. BYUND focuses on the pay-in rail; you control payouts and business logic.",
  },
  {
    title: "Exporters & remote-first teams",
    body: "Receive USD from customers or partners abroad without asking them to wire money or open new accounts. Keep a single view of all incoming flows.",
  },
  {
    title: "Fintechs & wallets",
    body: "Use BYUND as a simple rail to accept USD into your product, while keeping custody, treasury, and UX fully under your control.",
  },
];

export default function WhoItsFor() {
  return (
    <section
      id="who-its-for"
      className="relative rounded-3xl border border-border bg-accent-soft/60 px-4 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16"
    >
      {/* subtle darker blue glow at top */}
      <div className="pointer-events-none absolute inset-x-8 -top-24 h-40 rounded-[120px] bg-linear-to-r from-accent/25 via-accent/15 to-accent/0 blur-3xl" />

      <div className="relative grid gap-10 md:min-h-[80vh] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Left: sticky visual (new image, same position) */}
        <div className="md:sticky md:top-28 md:self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
          >
            <div className="aspect-4/3 bg-liniear-to-br from-accent-soft/40 via-white to-accent/10">
              <div className="flex h-full flex-col justify-between p-4 md:p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-muted shadow-sm backdrop-blur">
                  Merchant overview
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>

                <div className="space-y-3 text-xs text-foreground/85">
                  <div className="flex items-center justify-between rounded-2xl bg-white/95 p-3 shadow-sm backdrop-blur">
                    <div>
                      <p className="text-[11px] text-muted">Last 30 days</p>
                      <p className="text-sm font-semibold">$184,320.00</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                      ▲ 18.4%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-white/90 p-3 backdrop-blur">
                      <p className="text-[11px] text-muted">Successful</p>
                      <p className="text-sm font-semibold">98.7%</p>
                    </div>
                    <div className="rounded-2xl bg-white/90 p-3 backdrop-blur">
                      <p className="text-[11px] text-muted">Avg. settlement</p>
                      <p className="text-sm font-semibold">~ 6 min</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/80 p-3 backdrop-blur">
                    <p className="text-[11px] text-muted">Top regions</p>
                    <p className="text-[11px] text-muted">
                      Lagos • Nairobi • London • Dubai
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="mt-3 text-xs text-muted">
            This panel can become a real BYUND merchant dashboard shot. The
            position mirrors the previous section so the scroll feels continuous.
          </p>
        </div>

        {/* Right: segments + CTA */}
        <div className="space-y-8 md:space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-3"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Who BYUND is for
            </p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Built for teams who live in USD.
            </h2>
            <p className="max-w-lg text-sm text-muted md:text-base">
              Whether you&apos;re shipping software, running a marketplace, or
              working across borders, BYUND gives you a single place to see and
              control your incoming USD flows.
            </p>
          </motion.div>

          <div className="space-y-4 pb-4 md:pb-10">
            {segments.map((segment, index) => (
              <motion.div
                key={segment.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: index * 0.07,
                }}
                className="group rounded-2xl border border-border/70 bg-white/95 p-4 shadow-[0_14px_40px_rgba(15,17,21,0.04)] backdrop-blur-sm md:p-5"
              >
                <h3 className="text-sm font-medium md:text-base">
                  {segment.title}
                </h3>
                <p className="mt-1 text-xs text-muted md:text-sm">
                  {segment.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
