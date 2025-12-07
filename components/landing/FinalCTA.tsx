// components/landing/FinalCTA.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function FinalCTA() {
  const email = "founders@byund.com"; // TODO: replace with real inbox

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-surface px-6 py-10 text-center md:px-10 md:py-14"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Early access
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Join the first teams building on BYUND.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-muted md:text-base">
            We&apos;re starting with USD payment links and a hosted checkout
            experience. If that solves a real need for your business today,
            tell us about your use case and we&apos;ll explore a fit for this
            early cohort.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`mailto:${email}?subject=BYUND%20early%20access&body=Tell%20us%20about%20your%20business%2C%20current%20payment%20flows%2C%20and%20why%20USD%20payment%20links%20matter.`}
            >
              <Button variant="primary">
                Request early access
              </Button>
            </Link>

            <Link
              href={`mailto:${email}?subject=BYUND%20call&body=Share%20a%20few%20lines%20about%20your%20use%20case%20and%20what%20you%27d%20like%20to%20discuss.`}
            >
              <Button variant="secondary">
                Talk to the team
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-muted">
            If you need features beyond V1 (like invoicing automation or
            subscription billing), we may not be able to support them
            immediately — but your needs help shape our roadmap.
          </p>

          <p className="mt-2 text-[11px] text-muted">
            Powered by <span className="tracking-[0.35em]">B Y U N D</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
