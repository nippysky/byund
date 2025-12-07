// components/landing/ForDevelopers.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const devPoints = [
  {
    title: "Clean REST API",
    body: "Create payment links and reconcile payments with simple JSON endpoints that drop into any backend stack.",
  },
  {
    title: "Real-time webhooks",
    body: "Receive events like payment_link.created and payment_link.paid to update your own records, grant access, or fulfill orders.",
  },
  {
    title: "Lightweight JS SDK",
    body: "Use BYUND in React and Next.js with a tiny SDK and copy-paste examples for hosted checkout and client-side integrations.",
  },
];

const codeSample = `POST /v1/payment-links
{
  "amount": 2500,
  "currency": "USD",
  "reference": "INV-1043",
  "metadata": {
    "customer_id": "cust_8293",
    "plan": "pro"
  },
  "callback_url": "https://yourapp.com/webhooks/byund"
}`;

export default function ForDevelopers() {
  return (
    <section
      id="developers"
      className="relative w-full bg-accent text-white"
    >
      {/* inner container matches main width */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-14 lg:py-16">
        <div className="relative rounded-3xl border border-white/10 bg-accent px-4 py-8 md:px-8 md:py-12 lg:px-10 lg:py-14">
          {/* subtle highlight */}
          <div className="pointer-events-none absolute inset-x-4 -top-24 h-40 rounded-[120px] bg-linear-to-r from-white/20 via-white/10 to-transparent blur-3xl" />

          <div className="relative grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
            {/* Left: dev story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                  Built for developers
                </p>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  APIs, webhooks, and SDKs from day one.
                </h2>
                <p className="max-w-lg text-sm text-white/80 md:text-base">
                  BYUND is designed to drop into your existing stack, not force
                  you into a new one. Start with test keys, hit the sandbox, and
                  wire up your first payment-link flow in an afternoon.
                </p>
              </div>

              <div className="space-y-6 text-sm text-white/85">
                {devPoints.map((point) => (
                  <div key={point.title} className="space-y-1">
                    <h3 className="font-medium">{point.title}</h3>
                    <p className="text-xs text-white/75 md:text-sm">
                      {point.body}
                    </p>
                  </div>
                ))}
              </div>

              <Button
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20 border-white/30"
              >
                View API reference
              </Button>
            </motion.div>

            {/* Right: code “screenshot” */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-black/15 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/45 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-[11px] text-white/60">
                    byund.api / payment-links.ts
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-white/85 md:p-5">
                  <code>{codeSample}</code>
                </pre>
              </div>

              <p className="mt-3 text-xs text-white/70">
                Swap this for a real BYUND API example once the backend is live.
                It&apos;s your developer-facing preview on the main page.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
