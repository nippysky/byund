// components/landing/FinalCTA.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function FinalCTA() {
  const email = "founders@byund.com"; // TODO: plug into real inbox later

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
            Get started
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Start accepting USD payments with BYUND.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-muted md:text-base">
            Create an account, connect your wallet, and spin up your first USD
            payment link or hosted checkout in a few minutes. No sales calls
            required.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Get started
              </Button>
            </Link>

            <Link href="/docs">
              <Button variant="secondary" size="lg">
                View documentation
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-muted">
            Have a larger-volume or more complex use case?{" "}
            <a
              href={`mailto:${email}?subject=BYUND%20questions`}
              className="underline underline-offset-4"
            >
              Talk to the team
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
