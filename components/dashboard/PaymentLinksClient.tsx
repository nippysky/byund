"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CreatePaymentLinkButton } from "./CreatePaymentLinkButton";

type DashboardMode = "TEST" | "LIVE";
type PaymentLinkMode = "FIXED" | "VARIABLE";

type LinkRow = {
  id: string;
  publicId: string;
  name: string;
  mode: PaymentLinkMode;
  fixedAmountCents: number | null;
  isActive: boolean;
  createdAt: string; // ISO
};

type CreatedLinkLike = {
  id?: string;
  publicId: string;
  name: string;
  mode: PaymentLinkMode | "fixed" | "variable";
  fixedAmountCents?: number | null;
  isActive?: boolean;
  createdAt?: string;
};

function moneyFromCents(cents: number) {
  const n = cents / 100;
  return `USD ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatAmount(link: LinkRow): string {
  if (link.mode === "VARIABLE") return "Customer decides";
  if (link.fixedAmountCents == null) return "—";
  return moneyFromCents(link.fixedAmountCents);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeCreatedLink(created: CreatedLinkLike): LinkRow {
  const modeUpper: PaymentLinkMode =
    created.mode === "fixed"
      ? "FIXED"
      : created.mode === "variable"
      ? "VARIABLE"
      : created.mode;

  return {
    id: created.id ?? `tmp_${created.publicId}`,
    publicId: created.publicId,
    name: created.name,
    mode: modeUpper,
    fixedAmountCents: created.fixedAmountCents ?? null,
    isActive: created.isActive ?? true,
    createdAt: created.createdAt ? new Date(created.createdAt).toISOString() : new Date().toISOString(),
  };
}

export default function PaymentLinksClient({
  env,
  initialLinks,
}: {
  env: DashboardMode;
  initialLinks: LinkRow[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Optimistic list; server remains source of truth after refresh
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [isPending, startTransition] = useTransition();

  const hasLinks = links.length > 0;

  const totalActive = useMemo(() => links.filter((l) => l.isActive).length, [links]);

  function handleCreated(created: CreatedLinkLike) {
    const row = normalizeCreatedLink(created);

    setLinks((prev) => {
      // de-dupe if refresh already brought it in
      if (prev.some((p) => p.publicId === row.publicId)) return prev;
      return [row, ...prev];
    });

    toast({
      title: "Payment link created",
      variant: "success",
      message: "Your link is ready to share.",
    });

    startTransition(() => router.refresh());
  }

  async function handleCopy(link: LinkRow) {
    try {
      if (typeof window === "undefined") return;
      const url = `${window.location.origin}/pay/${link.publicId}`;

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast({ title: "Copied", message: "Payment link URL copied to clipboard." });
      } else {
        toast({
          title: "Copy not supported",
          variant: "warning",
          message: "Your browser doesn’t support clipboard copy.",
        });
      }
    } catch {
      toast({ title: "Copy failed", variant: "error", message: "Try again." });
    }
  }

  return (
    <div className="space-y-4">
      {/* Top row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="hidden rounded-full bg-surface px-2 py-1 md:inline-block">
            <span className="font-medium text-foreground">{links.length}</span> total
          </span>
          <span className="rounded-full bg-surface px-2 py-1">
            <span className="font-medium text-foreground">{totalActive}</span> active
          </span>
          <span className="rounded-full border border-border bg-white px-2 py-1">
            <span className="font-medium text-foreground">{env === "LIVE" ? "Live" : "Test"}</span>{" "}
            mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden md:inline-flex">
            View docs
          </Button>

          {/* Button owns the API call + modal loading state */}
          <CreatePaymentLinkButton size="sm" onCreated={handleCreated} />
        </div>
      </div>

      {/* Table / Empty state */}
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
                      key={link.publicId}
                      className={
                        "text-xs text-foreground/90 transition-colors hover:bg-surface/60 " +
                        (isLast ? "" : "border-b border-border/60")
                      }
                    >
                      {/* Link name + URL (short display, full copy) */}
                      <td className="max-w-[320px] px-4 py-3 align-top">
                        <div className="space-y-0.5">
                          <p className="truncate text-[13px] font-medium tracking-[-0.01em]">
                            {link.name}
                          </p>
                          <p className="truncate font-mono text-[11px] text-muted">
                            /pay/{link.publicId.slice(0, 10)}
                            {link.publicId.length > 10 ? "…" : ""}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">
                          {link.mode === "FIXED" ? "Fixed amount" : "Customer decides"}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <span className="text-[13px]">{formatAmount(link)}</span>
                      </td>

                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground">
                          <span className={"h-1.5 w-1.5 rounded-full " + (link.isActive ? "bg-emerald-500" : "bg-border")} />
                          {link.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-3 align-top text-[11px] text-muted">
                        {formatDate(link.createdAt)}
                      </td>

                      <td className="px-4 py-3 align-top text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                            onClick={() => router.push(`/dashboard/payment-links/${link.publicId}`)}
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

            {/* tiny sync indicator */}
            <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-2 text-[11px] text-muted">
              <span className={"h-1.5 w-1.5 rounded-full " + (isPending ? "bg-amber-400" : "bg-emerald-500")} />
              <span>{isPending ? "Syncing…" : "Up to date"}</span>
            </div>
          </div>
        ) : (
          <div className="px-5 py-8 text-sm">
            <p className="font-medium tracking-[-0.01em]">No payment links yet</p>
            <p className="mt-2 text-sm text-muted">
              Create your first link. Your dashboard is currently in{" "}
              <span className="font-medium">{env === "LIVE" ? "Live" : "Test"}</span> mode.
            </p>
            <div className="mt-4">
              <CreatePaymentLinkButton size="sm" onCreated={handleCreated} />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-surface/40 px-4 py-4 text-xs text-muted md:px-5 md:py-5">
        <p className="font-medium text-foreground">Per-link analytics (coming soon)</p>
        <p className="mt-1">
          Once payments are wired, we’ll show conversion, payment statuses, and settlement timelines per link.
        </p>
      </div>
    </div>
  );
}
