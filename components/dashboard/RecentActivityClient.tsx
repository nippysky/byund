// components/dashboard/RecentActivityClient.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Copy, Eye, ReceiptText } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

type PaymentStatus = "CONFIRMED" | "SUBMITTED" | "CREATED" | "FAILED" | "CANCELED";

export type ActivityRow =
  | {
      kind: "payment";
      id: string;
      at: string; // ISO
      label: string;
      sublabel: string;
      status: PaymentStatus;
      amountUsdCents: number;
      linkPublicId: string | null;
    }
  | {
      kind: "link";
      id: string;
      at: string; // ISO
      label: string;
      sublabel: string; // /pay/xxxx
      isActive: boolean;
      publicId: string;
    };

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

function absUrl(path: string) {
  if (typeof window === "undefined") return path;

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    window.location.origin;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const cleanBase = basePath
    ? basePath.startsWith("/")
      ? basePath
      : `/${basePath}`
    : "";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(`${cleanBase}${cleanPath}`, origin).toString();
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const tone =
    status === "CONFIRMED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "FAILED" || status === "CANCELED"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-surface text-muted border-border";

  const label =
    status === "CONFIRMED"
      ? "Succeeded"
      : status === "SUBMITTED"
      ? "Submitted"
      : status === "CREATED"
      ? "Created"
      : status === "FAILED"
      ? "Failed"
      : "Canceled";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium", tone)}>
      {label}
    </span>
  );
}

function LinkStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-border bg-surface text-muted"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-border")} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export default function RecentActivityClient({ items }: { items: ActivityRow[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const hasItems = items.length > 0;

  const rows = useMemo(() => items, [items]);

  async function copyText(text: string) {
    try {
      if (typeof window === "undefined") return;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({ title: "Copied", message: "Copied to clipboard." });
      } else {
        toast({ title: "Copy not supported", variant: "warning", message: "Your browser doesn’t support clipboard copy." });
      }
    } catch {
      toast({ title: "Copy failed", variant: "error", message: "Try again." });
    }
  }

  function goToActivity(publicId: string | null) {
    if (!publicId) return;
    router.push(`/dashboard/activity?link=${encodeURIComponent(publicId)}`);
  }

  function openPay(publicId: string) {
    if (typeof window === "undefined") return;
    window.open(absUrl(`/pay/${publicId}`), "_blank", "noopener,noreferrer");
  }

  if (!hasItems) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/40 px-4 py-5">
        <p className="text-sm font-medium tracking-[-0.01em]">Nothing yet</p>
        <p className="mt-1 text-sm text-muted">
          When your first payments arrive, you’ll see events here (links, payments, confirmations).
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Mobile: card rows */}
      <div className="divide-y divide-border md:hidden">
        {rows.map((item) => {
          const isPayment = item.kind === "payment";

          return (
            <div key={`${item.kind}_${item.id}`} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-foreground">{item.label}</p>
                  <p className="mt-1 truncate text-[12px] text-muted">{item.sublabel}</p>
                </div>

                <div className="shrink-0">
                  {isPayment ? (
                    <PaymentStatusBadge status={item.status} />
                  ) : (
                    <LinkStatusBadge isActive={item.isActive} />
                  )}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <span className="rounded-full bg-surface px-2 py-1">{isPayment ? "Payment" : "Link"}</span>
                <span className="rounded-full bg-surface px-2 py-1">{formatWhen(item.at)}</span>
                {isPayment ? (
                  <span className="rounded-full bg-surface px-2 py-1">{formatUsdFromCents(item.amountUsdCents)}</span>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {isPayment ? (
                  <button
                    type="button"
                    onClick={() => goToActivity(item.linkPublicId)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:bg-white hover:text-foreground disabled:opacity-60"
                    disabled={!item.linkPublicId}
                    title={!item.linkPublicId ? "Missing link reference" : "View in Activity"}
                  >
                    <ReceiptText className="h-3.5 w-3.5" />
                    View
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openPay(item.publicId)}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:bg-white hover:text-foreground"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => copyText(absUrl(`/pay/${item.publicId}`))}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:bg-white hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>

                    <button
                      type="button"
                      onClick={() => goToActivity(item.publicId)}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:bg-white hover:text-foreground"
                    >
                      <ReceiptText className="h-3.5 w-3.5" />
                      Payments
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: full-width table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-surface/60 text-[11px] uppercase tracking-[0.16em] text-muted">
                <th className="px-4 py-3 text-left font-medium">Event</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Status / Amount</th>
                <th className="px-4 py-3 text-left font-medium">Time</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((item, idx) => {
                const isLast = idx === rows.length - 1;
                const isPayment = item.kind === "payment";

                return (
                  <tr
                    key={`${item.kind}_${item.id}`}
                    className={cn(
                      "text-xs text-foreground/90 transition-colors hover:bg-surface/60",
                      isLast ? "" : "border-b border-border/60"
                    )}
                  >
                    <td className="max-w-130 px-4 py-3 align-top">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium tracking-[-0.01em]">{item.label}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted">{item.sublabel}</p>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">
                        {isPayment ? "Payment" : "Link"}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        {isPayment ? (
                          <>
                            <span className="text-[12px] font-medium text-foreground">
                              {formatUsdFromCents(item.amountUsdCents)}
                            </span>
                            <PaymentStatusBadge status={item.status} />
                          </>
                        ) : (
                          <LinkStatusBadge isActive={item.isActive} />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top text-[11px] text-muted">{formatWhen(item.at)}</td>

                    <td className="px-4 py-3 align-top text-right">
                      {isPayment ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => goToActivity(item.linkPublicId)}
                            disabled={!item.linkPublicId}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground disabled:opacity-60"
                          >
                            <ReceiptText className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">View</span>
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openPay(item.publicId)}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">Open</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => copyText(absUrl(`/pay/${item.publicId}`))}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">Copy</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => goToActivity(item.publicId)}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                          >
                            <ReceiptText className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">Payments</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end border-t border-border px-4 py-2 text-[11px] text-muted">
          Lagos time (WAT)
        </div>
      </div>
    </div>
  );
}
