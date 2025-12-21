"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  Copy,
  ArrowLeft,
} from "lucide-react";

export type PaymentStatus =
  | "CONFIRMED"
  | "SUBMITTED"
  | "CREATED"
  | "FAILED"
  | "CANCELED";

export type PayStatusPayload = {
  paymentId: string;
  status: PaymentStatus;
  amountUsdCents: number;
  createdAtIso: string;

  link: {
    publicId: string;
    linkName: string;
  };

  merchant: {
    merchantName: string;
    brandBg: string;
    brandText: string;
  };
};

type Props = {
  initial: PayStatusPayload;
  currentYear: number;
};

const BYUND_BLUE = "#0066ff";
const BYUND_WHITE = "#ffffff";

function isHexColor(s: unknown): s is string {
  if (typeof s !== "string") return false;
  return /^#([0-9a-fA-F]{6})$/.test(s.trim());
}

// ✅ Always 2dp (brand consistency)
function formatUsdFromCents(cents: number) {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const tz = "Africa/Lagos";
  return new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

// Contrast helpers (WCAG-ish)
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}
function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function contrastRatio(a: string, b: string) {
  const L1 = luminance(a);
  const L2 = luminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveBrand(bg: unknown, text: unknown) {
  const brandBg = isHexColor(bg) ? bg : BYUND_BLUE;
  const rawText = isHexColor(text) ? text : BYUND_WHITE;

  const cr = contrastRatio(brandBg, rawText);
  const brandText =
    cr >= 4.0
      ? rawText
      : contrastRatio(brandBg, "#ffffff") >= contrastRatio(brandBg, "#0b1220")
      ? "#ffffff"
      : "#0b1220";

  const isTextLight =
    contrastRatio(brandBg, "#ffffff") > contrastRatio(brandBg, "#0b1220");

  return { bg: brandBg, text: brandText, isTextLight };
}

function statusTone(s: PaymentStatus) {
  if (s === "CONFIRMED") return "success";
  if (s === "FAILED" || s === "CANCELED") return "danger";
  return "neutral";
}

function statusTitle(s: PaymentStatus) {
  if (s === "CONFIRMED") return "Payment received";
  if (s === "FAILED") return "Payment not completed";
  if (s === "CANCELED") return "Payment canceled";
  return "Processing payment";
}

function statusSubtitle(s: PaymentStatus) {
  if (s === "CONFIRMED") return "You can close this tab now.";
  if (s === "FAILED") return "No funds were collected.";
  if (s === "CANCELED") return "No funds were collected.";
  return "This usually updates in a moment.";
}

function StatusMark({ status }: { status: PaymentStatus }) {
  const tone = statusTone(status);

  if (tone === "success") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50">
        <CheckCircle2 className="h-5 w-5 text-emerald-700" />
      </span>
    );
  }
  if (tone === "danger") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50">
        <XCircle className="h-5 w-5 text-rose-700" />
      </span>
    );
  }

  // Neutral / processing: calm pulse
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-surface">
      <span className="absolute inline-flex h-7 w-7 animate-ping rounded-xl bg-foreground/10" />
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-xl border border-border bg-white">
        <Clock3 className="h-4 w-4 text-foreground/70" />
      </span>
    </span>
  );
}

function StatusTimeline({
  status,
  brandBg,
}: {
  status: PaymentStatus;
  brandBg: string;
}) {
  const steps = [
    { key: "CREATED" as const, label: "Created" },
    { key: "SUBMITTED" as const, label: "Submitted" },
    { key: "CONFIRMED" as const, label: "Confirmed" },
  ];

  const isError = status === "FAILED" || status === "CANCELED";

  const currentIndex =
    status === "CONFIRMED"
      ? 2
      : status === "SUBMITTED"
      ? 1
      : status === "CREATED"
      ? 0
      : 1; // failed/canceled usually after submit; keep it graceful

  return (
    <div className="mt-4">
      <div className="relative">
        {/* Track */}
        <div className="absolute left-0 right-0 top-2.5 h-0.5 rounded-full bg-border" />

        {/* Progress */}
        <div
          className="absolute left-0 top-2.5 h-0.5 rounded-full"
          style={{
            width: `${(Math.max(0, Math.min(2, currentIndex)) / 2) * 100}%`,
            backgroundColor: isError ? "#ef4444" : brandBg,
            opacity: isError ? 0.7 : 0.85,
          }}
        />

        {/* Nodes */}
        <div className="relative grid grid-cols-3">
          {steps.map((s, i) => {
            const done = i < currentIndex || status === "CONFIRMED";
            const active = i === currentIndex && !done && !isError;
            const nodeBg = isError
              ? "bg-rose-50 border-rose-200"
              : done
              ? "bg-white border-border"
              : "bg-white border-border";

            const dotStyle: React.CSSProperties = isError
              ? { backgroundColor: "#ef4444" }
              : done
              ? { backgroundColor: brandBg }
              : active
              ? { backgroundColor: brandBg, opacity: 0.9 }
              : { backgroundColor: "rgb(203 213 225)" }; // slate-300-ish

            const labelTone = isError
              ? "text-rose-700"
              : done
              ? "text-foreground"
              : active
              ? "text-foreground"
              : "text-muted";

            return (
              <div key={s.key} className="flex flex-col items-center">
                <div
                  className={[
                    "relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border",
                    nodeBg,
                  ].join(" ")}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={dotStyle}
                    aria-hidden="true"
                  />
                </div>

                <p
                  className={[
                    "mt-2 text-[11px] font-medium tracking-[-0.01em]",
                    labelTone,
                  ].join(" ")}
                >
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {isError ? (
        <p className="mt-3 text-center text-[11px] text-rose-700/90">
          This payment didn’t complete.
        </p>
      ) : status === "CONFIRMED" ? (
        <p className="mt-3 text-center text-[11px] text-muted">
          Confirmed.
        </p>
      ) : (
        <p className="mt-3 text-center text-[11px] text-muted">
          Updating automatically.
        </p>
      )}
    </div>
  );
}

export default function PayStatusClient({ initial, currentYear }: Props) {
  const [data, setData] = useState<PayStatusPayload>(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const brand = useMemo(
    () => resolveBrand(data.merchant.brandBg, data.merchant.brandText),
    [data.merchant.brandBg, data.merchant.brandText]
  );

  const done =
    data.status === "CONFIRMED" || data.status === "FAILED" || data.status === "CANCELED";

  const mountedRef = useRef(true);
  const stopRef = useRef(false);
  const startMsRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const shortRef = useMemo(() => data.paymentId.slice(0, 8).toUpperCase(), [data.paymentId]);

  // Soft pill styling that adapts to light/dark brand
  const pillStyle = brand.isTextLight
    ? {
        backgroundColor: "rgba(255,255,255,0.14)",
        borderColor: "rgba(255,255,255,0.22)",
        color: "rgba(255,255,255,0.92)",
      }
    : {
        backgroundColor: "rgba(0,0,0,0.08)",
        borderColor: "rgba(0,0,0,0.12)",
        color: "rgba(0,0,0,0.78)",
      };

  async function fetchStatus(signal?: AbortSignal) {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/public/payments/${encodeURIComponent(data.paymentId)}`, {
        method: "GET",
        cache: "no-store",
        signal,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) return;

      const next: PayStatusPayload = {
        paymentId: json.payment.id,
        status: json.payment.status,
        amountUsdCents: json.payment.amountUsdCents,
        createdAtIso: json.payment.createdAt,
        link: {
          publicId: json.payment.link.publicId,
          linkName: json.payment.link.name,
        },
        merchant: {
          merchantName: json.payment.merchant.name,
          brandBg: json.payment.merchant.brandBg,
          brandText: json.payment.merchant.brandText,
        },
      };

      if (!mountedRef.current) return;

      setData(next);

      if (next.status === "CONFIRMED" || next.status === "FAILED" || next.status === "CANCELED") {
        stopRef.current = true;
      }
    } catch {
      // silent — status UI should be resilient
    } finally {
      if (mountedRef.current) setRefreshing(false);
    }
  }

  function clearTimer() {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function scheduleNextPoll() {
    if (stopRef.current) return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;

    const elapsed = Date.now() - startMsRef.current;

    // 0–30s => 2s
    // 30–150s => 6s
    // 150–300s => 12s
    // stop after 5 min
    let delay = 2000;
    if (elapsed >= 30_000) delay = 6000;
    if (elapsed >= 150_000) delay = 12_000;
    if (elapsed >= 300_000) return;

    clearTimer();
    timerRef.current = window.setTimeout(async () => {
      if (stopRef.current) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      await fetchStatus(abortRef.current.signal);
      scheduleNextPoll();
    }, delay);
  }

  useEffect(() => {
    mountedRef.current = true;
    stopRef.current = false;
    startMsRef.current = Date.now();

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    fetchStatus(abortRef.current.signal).finally(() => {
      scheduleNextPoll();
    });

    const onVisibility = () => {
      if (stopRef.current) return;
      if (document.visibilityState === "visible") {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        fetchStatus(abortRef.current.signal).finally(() => {
          scheduleNextPoll();
        });
      } else {
        clearTimer();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountedRef.current = false;
      stopRef.current = true;
      clearTimer();
      abortRef.current?.abort();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.paymentId]);

  async function onCopyRef() {
    try {
      if (typeof window === "undefined") return;
      if (!navigator?.clipboard?.writeText) return;

      await navigator.clipboard.writeText(data.paymentId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // silent
    }
  }

  const ctaPrimaryHref = `/pay/${encodeURIComponent(data.link.publicId)}`;
  const showTryAgain = data.status === "FAILED" || data.status === "CANCELED";
  const showDone = data.status === "CONFIRMED";

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT: brand panel */}
        <section
          className="relative flex min-h-[44vh] flex-col overflow-hidden p-6 lg:min-h-screen lg:p-10"
          style={{ backgroundColor: brand.bg, color: brand.text }}
        >
          {/* subtle grid + bloom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.18,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
              backgroundSize: "76px 76px",
              backgroundPosition: "center",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0.22,
              background:
                "radial-gradient(900px 700px at 20% 28%, rgba(255,255,255,0.30), transparent 60%), radial-gradient(700px 520px at 76% 70%, rgba(0,0,0,0.18), transparent 55%)",
            }}
          />

          <div className="relative flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 leading-tight">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.78 }}>
                    Payment to
                  </p>
                  <p className="mt-1 truncate text-[18px] font-semibold tracking-[-0.03em]">
                    {data.merchant.merchantName}
                  </p>
                </div>

                <span
                  className="inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur"
                  style={pillStyle}
                >
                  USDC on Base
                </span>
              </div>

              <div className="mt-10">
                <p className="text-[12px] uppercase tracking-[0.22em]" style={{ opacity: 0.78 }}>
                  For
                </p>
                <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] lg:text-[34px]">
                  {data.link.linkName}
                </h1>
              </div>

              {/* Calm details strip */}
              <div
                className="mt-8 rounded-3xl border p-5 backdrop-blur"
                style={{
                  borderColor: brand.isTextLight ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.10)",
                  backgroundColor: brand.isTextLight ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.04)",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.78 }}>
                    Amount
                  </p>
                  <p className="text-[13px] font-semibold tracking-[-0.01em]">
                    {formatUsdFromCents(data.amountUsdCents)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.78 }}>
                    Reference
                  </p>
                  <p className="font-mono text-[12px]" style={{ opacity: 0.9 }}>
                    {shortRef}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: status */}
        <section className="flex min-h-[56vh] flex-col items-center justify-center bg-white p-6 lg:min-h-screen lg:p-10">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_16px_50px_rgba(15,17,21,0.07)] lg:p-7">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Payment status
                  </p>
                  <p className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-foreground">
                    {statusTitle(data.status)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{statusSubtitle(data.status)}</p>
                </div>

                <div className="flex items-center gap-2">
                  {!done ? (
                    <button
                      type="button"
                      onClick={() => {
                        abortRef.current?.abort();
                        abortRef.current = new AbortController();
                        fetchStatus(abortRef.current.signal);
                      }}
                      disabled={refreshing}
                      className={[
                        "inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-white transition",
                        refreshing ? "opacity-60 cursor-wait" : "hover:bg-surface",
                      ].join(" ")}
                      aria-label="Refresh"
                      title="Refresh"
                    >
                      <RefreshCw
                        className={[
                          "h-4 w-4 text-foreground/70",
                          refreshing ? "animate-spin" : "",
                        ].join(" ")}
                      />
                    </button>
                  ) : null}

                  <StatusMark status={data.status} />
                </div>
              </div>

              {/* ✅ Apple-clean timeline */}
              <StatusTimeline status={data.status} brandBg={brand.bg} />

              {/* Details */}
              <div className="mt-6 space-y-2 rounded-2xl border border-border bg-surface/40 p-4 text-[12px] text-muted">
                <div className="flex items-center justify-between gap-3">
                  <span>Amount</span>
                  <span className="font-semibold text-foreground">
                    {formatUsdFromCents(data.amountUsdCents)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Time</span>
                  <span className="text-foreground/80">{formatWhen(data.createdAtIso)}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span>Reference</span>
                  <span className="inline-flex items-center gap-2">
                    <span className="font-mono text-foreground/80">{shortRef}</span>
                    <button
                      type="button"
                      onClick={onCopyRef}
                      className="inline-flex items-center justify-center rounded-full border border-border bg-white px-2 py-1 text-[11px] text-muted hover:text-foreground"
                      aria-label="Copy reference"
                      title="Copy reference"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>

                {copied ? (
                  <div className="pt-1 text-[11px] text-foreground/70">Copied.</div>
                ) : null}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                {!done ? (
                  <>
                    <Link className="sm:flex-1" href={ctaPrimaryHref}>
                      <Button variant="secondary" className="w-full justify-center">
                        <span className="inline-flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </span>
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      className="sm:flex-1 w-full justify-center rounded-2xl py-3 text-[13px] font-semibold shadow-[0_10px_28px_rgba(0,0,0,0.10)]"
                      onClick={() => {
                        abortRef.current?.abort();
                        abortRef.current = new AbortController();
                        fetchStatus(abortRef.current.signal);
                      }}
                      disabled={refreshing}
                      style={{ backgroundColor: brand.bg, color: brand.text }}
                    >
                      {refreshing ? "Refreshing…" : "Refresh"}
                    </Button>
                  </>
                ) : showDone ? (
                  <>
                    <Link className="sm:flex-1" href={ctaPrimaryHref}>
                      <Button
                        className="w-full justify-center rounded-2xl py-3 text-[13px] font-semibold shadow-[0_10px_28px_rgba(0,0,0,0.10)]"
                        style={{ backgroundColor: brand.bg, color: brand.text }}
                      >
                        Done
                      </Button>
                    </Link>

                    <Link className="sm:flex-1" href={ctaPrimaryHref}>
                      <Button variant="secondary" className="w-full justify-center">
                        Make another payment
                      </Button>
                    </Link>
                  </>
                ) : showTryAgain ? (
                  <>
                    <Link className="sm:flex-1" href={ctaPrimaryHref}>
                      <Button
                        className="w-full justify-center rounded-2xl py-3 text-[13px] font-semibold shadow-[0_10px_28px_rgba(0,0,0,0.10)]"
                        style={{ backgroundColor: brand.bg, color: brand.text }}
                      >
                        Try again
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      variant="secondary"
                      className="sm:flex-1 w-full justify-center"
                      onClick={() => {
                        abortRef.current?.abort();
                        abortRef.current = new AbortController();
                        fetchStatus(abortRef.current.signal);
                      }}
                      disabled={refreshing}
                    >
                      {refreshing ? "Refreshing…" : "Refresh"}
                    </Button>
                  </>
                ) : (
                  <Link className="w-full" href={ctaPrimaryHref}>
                    <Button className="w-full justify-center" variant="secondary">
                      Back
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Footer */}
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
