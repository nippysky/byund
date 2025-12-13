"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreatePaymentLinkButton, NewPaymentLinkValues } from "./CreatePaymentLinkButton";
import { Button } from "@/components/ui/Button";
import { Eye, Copy } from "lucide-react";

type PaymentLinkMode = "fixed" | "variable";
type PaymentLinkStatus = "active" | "inactive";

type PaymentLink = {
  id: string;
  name: string;
  mode: PaymentLinkMode;
  amount?: string | null;
  createdAt: string; // ISO string
  status: PaymentLinkStatus;
};

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `link_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

function formatAmount(link: PaymentLink): string {
  if (link.mode === "variable") return "Customer decides";
  if (!link.amount) return "—";

  const n = Number(link.amount);
  if (Number.isNaN(n)) return `USD ${link.amount}`;

  return `USD ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  // Only used for client-created data (no SSR mismatch)
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaymentLinksClient() {
  const router = useRouter();

  // Start with no links so SSR + first client render match
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hasLinks = links.length > 0;

  function showToast(message: string) {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2500);
  }

  function handleCreated(values: NewPaymentLinkValues) {
    const newLink: PaymentLink = {
      id: generateId(),
      name: values.name,
      mode: values.mode,
      amount: values.mode === "fixed" ? values.amount ?? "" : null,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    setLinks((prev) => [newLink, ...prev]);
    showToast("Payment link created successfully.");
  }

  const totalActive = useMemo(
    () => links.filter((l) => l.status === "active").length,
    [links]
  );

  async function handleCopy(link: PaymentLink) {
    try {
      if (typeof window === "undefined") return;
      const url = `${window.location.origin}/pay/${link.id}`;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showToast("Payment link URL copied to clipboard.");
      } else {
        // Fallback: select-and-copy is overkill here, just show message
        showToast("Copy not supported in this browser.");
      }
    } catch {
      showToast("Failed to copy link URL.");
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* Top row: actions + small meta */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <span className="hidden rounded-full bg-surface px-2 py-1 md:inline-block">
              <span className="font-medium text-foreground">{links.length}</span>{" "}
              total links
            </span>
            <span className="rounded-full bg-surface px-2 py-1">
              <span className="font-medium text-foreground">{totalActive}</span>{" "}
              active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="hidden md:inline-flex"
            >
              View docs
            </Button>
            <CreatePaymentLinkButton size="sm" onCreated={handleCreated} />
          </div>
        </div>

        {/* Table or empty state */}
        <div className="rounded-2xl border border-border bg-white shadow-[0_8px_25px_rgba(15,17,21,0.06)]">
          {hasLinks ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="border-b border-border/70 bg-surface/60 text-[11px] uppercase tracking-[0.16em] text-muted">
                    <th className="px-4 py-3 text-left font-medium">Link</th>
                    <th className="px-4 py-3 text-left font-medium">Mode</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Created</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, index) => {
                    const isLast = index === links.length - 1;
                    return (
                      <tr
                        key={link.id}
                        className={
                          "text-xs text-foreground/90 transition-colors hover:bg-surface/60 " +
                          (isLast ? "" : "border-b border-border/60")
                        }
                      >
                        {/* Link name + stub URL */}
                        <td className="max-w-[260px] px-4 py-3 align-top">
                          <div className="space-y-0.5">
                            <p className="truncate text-[13px] font-medium tracking-[-0.01em]">
                              {link.name}
                            </p>
                            <p className="truncate font-mono text-[11px] text-muted">
                              /pay/{link.id.slice(0, 8)}
                            </p>
                          </div>
                        </td>

                        {/* Mode */}
                        <td className="px-4 py-3 align-top">
                          <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">
                            {link.mode === "fixed" ? "Fixed amount" : "Customer decides"}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 align-top">
                          <span className="text-[13px]">{formatAmount(link)}</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 align-top">
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground">
                            <span
                              className={
                                "h-1.5 w-1.5 rounded-full " +
                                (link.status === "active"
                                  ? "bg-emerald-500"
                                  : "bg-border")
                              }
                            />
                            {link.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3 align-top text-[11px] text-muted">
                          {formatDate(link.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 align-top text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                              onClick={() =>
                                router.push(`/dashboard/payment-links/${link.id}`)
                              }
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                              onClick={() => handleCopy(link)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-8 text-sm">
              <p className="font-medium tracking-[-0.01em]">
                No payment links yet
              </p>
              <p className="mt-2 text-sm text-muted">
                Start by creating your first link. You&apos;ll be able to set an
                amount or let customers decide, then share the URL with them.
              </p>
              <div className="mt-4">
                <CreatePaymentLinkButton size="sm" onCreated={handleCreated} />
              </div>
            </div>
          )}
        </div>

        {/* Future per-link activity placeholder */}
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-4 py-4 text-xs text-muted md:px-5 md:py-5">
          <p className="font-medium text-foreground">
            Per-link activity (coming soon)
          </p>
          <p className="mt-1">
            Clicking &quot;View&quot; takes you to a dedicated activity page for
            that link. Once the backend is wired, we&apos;ll show payments,
            statuses, and settlements there.
          </p>
        </div>
      </div>

      {/* Toast – bottom-right for this page */}
      {toastMessage && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-end px-4 md:bottom-6 md:px-6 lg:px-8">
          <div className="pointer-events-auto max-w-sm rounded-2xl border border-border bg-white px-4 py-3 shadow-lg shadow-black/5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Update
            </p>
            <p className="mt-1 text-sm text-foreground">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
