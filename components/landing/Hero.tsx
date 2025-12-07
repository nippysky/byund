// components/landing/Hero.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="flex flex-col items-start gap-10 pt-4 md:flex-row md:items-center md:justify-between lg:pt-8">
      {/* Left: copy + actions */}
      <div className="max-w-xl space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
        For Global-First Teams
        </p>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Receive USD from anywhere, with one link.
        </h1>

        <p className="text-muted md:text-lg text-[0.9rem]">
          BYUND gives your business simple USD payment links and a clean hosted
          checkout — so customers can pay you from anywhere, without you having
          to stitch together banks, wallets, or extra infrastructure.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="#pricing">
            <Button variant="primary">
              Request early access
            </Button>
          </Link>

          <Link href="#how-it-works">
            <Button variant="secondary">
              See how it works
            </Button>
          </Link>
        </div>
      </div>

      {/* Right: visual placeholder for future animated mock */}
      <div className="mt-4 w-full max-w-md md:mt-0 md:max-w-lg">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="aspect-16/10">
            {/* Gradient layer */}
            <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-white to-accent-soft/60" />

            {/* Mock card – replace with real screenshot / animation */}
            <div className="relative flex h-full flex-col justify-between p-4 md:p-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-muted shadow-sm backdrop-blur">
                USD payment link
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-muted">Paid</span>
              </div>

              <div className="space-y-2 text-xs text-foreground/80">
                <div className="flex items-center justify-between rounded-2xl bg-white/90 p-3 backdrop-blur">
                  <div>
                    <p className="text-[11px] text-muted">Invoice #1043</p>
                    <p className="text-sm font-semibold">SaaS subscription</p>
                  </div>
                  <span className="text-sm font-semibold">$1,250.00</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/70 p-3 backdrop-blur">
                  <p className="text-[11px] text-muted">
                    Merchant • Lagos, NG
                  </p>
                  <p className="text-[11px] text-muted">
                    Settled in minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted">
          Preview card — later, swap this for a real BYUND payment link or
          dashboard screenshot.
        </p>
      </div>
    </section>
  );
}
