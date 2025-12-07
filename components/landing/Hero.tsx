// components/landing/Hero.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="flex flex-col items-start gap-10 pt-4 md:flex-row md:items-center md:justify-between lg:pt-8">
      {/* Left: copy + actions */}
      <div className="max-w-xl space-y-6">
        {/* Optional tiny label – feels more permanent than “Early preview” */}
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
          Global USD rail
        </p>

        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Move USD beyond borders.
        </h1>

        <p className="text-base text-muted md:text-lg">
          BYUND is a modern payment rail for businesses that need simple,
          global, USD-denominated payments — without extra complexity or
          infrastructure overhead.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Primary CTA → register */}
          <Link href="/register">
            <Button variant="primary" size="lg">
              Get started
            </Button>
          </Link>

          {/* Secondary CTA → docs */}
          <Link href="/documentation">
            <Button variant="secondary" size="lg">
              View documentation
            </Button>
          </Link>
        </div>

        <p className="pt-4 text-xs text-muted">
          Powered by <span className="tracking-[0.35em]">B Y U N D</span>
        </p>
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
                Live settlement
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-2 text-xs text-foreground/80">
                <div className="flex items-center justify-between rounded-2xl bg-white/90 p-3 backdrop-blur">
                  <span>Invoice #1043</span>
                  <span className="font-semibold">$1,250.00</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/70 p-3 backdrop-blur">
                  <span>Merchant • Lagos, NG</span>
                  <span className="text-[11px] text-muted">
                    Settled in minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted">
          Preview card — swap for an actual BYUND dashboard or checkout visual.
        </p>
      </div>
    </section>
  );
}
