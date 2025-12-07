// components/landing/HowItWorks.tsx
"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "01",
    title: "Connect your business",
    body: "Create a BYUND account, connect your wallet, and choose how you want to receive USD balances. You can start in test mode in a few minutes.",
  },
  {
    label: "02",
    title: "Create a payment link or checkout",
    body: "Generate a hosted payment link or embed checkout into your product. You define the amount in USD, description, and metadata your system will reconcile with.",
  },
  {
    label: "03",
    title: "Customer pays in digital USD",
    body: "Your customer sees a clean amount in USD and a single confirmation step. Under the hood, funds move using supported digital dollars.",
  },
  {
    label: "04",
    title: "Track, settle, and automate",
    body: "See every payment in your BYUND dashboard, receive events via webhooks, and plug data into your own ledgers and workflows.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative rounded-3xl border border-border bg-linear-to-b from-white via-white to-surface/80 px-4 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16"
    >
      {/* soft brand glow */}
      <div className="pointer-events-none absolute inset-x-8 -top-24 h-40 rounded-[120px] bg-linear-to-r from-accent/10 via-accent/3 to-accent/0 blur-3xl" />

      <div className="relative grid gap-10 md:min-h-[80vh] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* Left: sticky visual */}
        <div className="md:sticky md:top-28 md:self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
          >
            <div className="aspect-4/3 bg-linear-to-br from-accent/8 via-white to-accent-soft/40">
              <div className="flex h-full flex-col justify-between p-4 md:p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-muted shadow-sm backdrop-blur">
                  BYUND flow
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-2xl bg-white/90 p-3 shadow-sm backdrop-blur">
                    <div>
                      <p className="text-[11px] text-muted">Incoming payment</p>
                      <p className="text-sm font-semibold">$2,400.00</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/70 p-3 backdrop-blur">
                    <p className="text-[11px] text-muted">
                      Platform balance • USD
                    </p>
                    <p className="text-[11px] text-muted">
                      Webhook delivered
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/60 p-3 backdrop-blur">
                    <p className="text-[11px] text-muted">
                      Your system
                    </p>
                    <p className="text-[11px] text-muted">
                      Access granted / order fulfilled
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="mt-3 text-xs text-muted">
            This visual stays anchored while you scroll through the flow.
            Replace it with a real BYUND dashboard or checkout animation when
            you have assets.
          </p>
        </div>

        {/* Right: scrolling copy (parallax feel against sticky visual) */}
        <div className="space-y-8 md:space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-3"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              How BYUND works
            </p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              One rail, four simple steps.
            </h2>
            <p className="max-w-lg text-sm text-muted md:text-base">
              BYUND abstracts networks and wallets into a single USD rail, so
              your team only thinks about customers, invoices, and settlement —
              not chains and bridges.
            </p>
          </motion.div>

          <div className="space-y-4 pb-4 md:pb-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  ease: "easeOut",
                  delay: index * 0.07,
                }}
                className="group flex gap-4 rounded-2xl border border-border bg-white/90 p-4 shadow-[0_14px_40px_rgba(15,17,21,0.03)] backdrop-blur-sm md:p-5"
              >
                <div className="mt-1 text-xs font-semibold text-muted">
                  {step.label}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium md:text-base">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted md:text-sm">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
