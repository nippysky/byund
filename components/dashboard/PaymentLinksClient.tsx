// components/dashboard/PaymentLinksClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Copy, ReceiptText, Loader2 } from "lucide-react";
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
    createdAt: created.createdAt
      ? new Date(created.createdAt).toISOString()
      : new Date().toISOString(),
  };
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

function StatusSwitch({
  checked,
  disabled,
  pending,
  onToggle,
}: {
  checked: boolean;
  disabled?: boolean;
  pending?: boolean;
  onToggle: () => void;
}) {
  const isDisabled = Boolean(disabled || pending);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={pending ? "true" : "false"}
      onClick={onToggle}
      disabled={isDisabled}
      title={checked ? "Disable link" : "Enable link"}
      className={[
        "group inline-flex items-center gap-2 select-none",
        isDisabled ? "opacity-70 cursor-wait" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
          checked
            ? "border-accent/40 bg-linear-to-r from-accent to-blue-600"
            : "border-red-500/30 bg-linear-to-r from-red-500 to-red-600",
          isDisabled ? "" : "hover:brightness-[0.98]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-0.5 top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" /> : null}
        </span>
      </span>

      <span className="text-[11px] font-medium text-foreground/80">
        {pending ? "Saving…" : checked ? "Active" : "Inactive"}
      </span>
    </button>
  );
}

export default function PaymentLinksClient({
  env,
  initialLinks,
  canCreate,
  onboardingHref,
}: {
  env: DashboardMode;
  initialLinks: LinkRow[];
  canCreate: boolean;
  onboardingHref: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [isPending, startTransition] = useTransition();

  const handledCreatedIdsRef = useRef<Set<string>>(new Set());
  const togglingRef = useRef<Set<string>>(new Set());
  const [, forceRerender] = useState(0);
  const isToggling = (publicId: string) => togglingRef.current.has(publicId);

  const hasLinks = links.length > 0;
  const totalActive = useMemo(() => links.filter((l) => l.isActive).length, [links]);

  function handleCreated(created: CreatedLinkLike) {
    const row = normalizeCreatedLink(created);

    if (handledCreatedIdsRef.current.has(row.publicId)) return;
    handledCreatedIdsRef.current.add(row.publicId);

    setLinks((prev) => {
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

  function getPublicPayUrl(link: LinkRow) {
    return absUrl(`/pay/${link.publicId}`);
  }

  function openPay(link: LinkRow) {
    if (typeof window === "undefined") return;
    window.open(getPublicPayUrl(link), "_blank", "noopener,noreferrer");
  }

  async function handleCopy(link: LinkRow) {
    try {
      if (typeof window === "undefined") return;

      const url = getPublicPayUrl(link);

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

  function openPayments(link: LinkRow) {
    router.push(`/dashboard/activity?link=${encodeURIComponent(link.publicId)}`);
  }

  async function toggleActive(link: LinkRow) {
    if (isToggling(link.publicId)) return;

    togglingRef.current.add(link.publicId);
    forceRerender((x) => x + 1);

    const next = !link.isActive;

    setLinks((prev) =>
      prev.map((l) => (l.publicId === link.publicId ? { ...l, isActive: next } : l))
    );

    try {
      const res = await fetch(`/api/payment-links/${encodeURIComponent(link.publicId)}/active`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next, environment: env }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");

      toast({
        title: next ? "Link enabled" : "Link disabled",
        message: next
          ? "This payment link is live again."
          : "Customers will no longer be able to pay with this link.",
      });

      startTransition(() => router.refresh());
    } catch {
      setLinks((prev) =>
        prev.map((l) => (l.publicId === link.publicId ? { ...l, isActive: !next } : l))
      );

      toast({
        title: "Update failed",
        variant: "error",
        message: "Couldn’t update link status. Try again.",
      });
    } finally {
      togglingRef.current.delete(link.publicId);
      forceRerender((x) => x + 1);
    }
  }

  return (
    <div className="space-y-4">
      {/* Wallet-required callout */}
      {!canCreate ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          <p className="font-medium text-amber-900 tracking-[-0.01em]">
            Finish setup to create payment links
          </p>
          <p className="mt-1 text-[13px] text-amber-900/80">
            Add your settlement wallet first — BYUND settles USDC on Base directly to it.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link href={onboardingHref}>
              <Button size="sm">Complete onboarding</Button>
            </Link>
            <Link href="/dashboard/settings/profile">
              <Button size="sm" variant="secondary">
                Go to settings
              </Button>
            </Link>
          </div>
        </div>
      ) : null}

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

          {canCreate ? (
            <CreatePaymentLinkButton size="sm" onCreated={handleCreated} />
          ) : (
            <Link href={onboardingHref}>
              <Button size="sm">Complete setup</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-[0_8px_25px_rgba(15,17,21,0.06)]">
        {hasLinks ? (
          <>
            {/* Mobile cards */}
            <div className="divide-y divide-border md:hidden">
              {links.map((link) => {
                const pending = isToggling(link.publicId);

                return (
                  <div key={link.publicId} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-foreground">
                          {link.name}
                        </p>
                        <p className="mt-1 truncate font-mono text-[11px] text-muted">
                          /pay/{link.publicId.slice(0, 10)}…
                        </p>
                      </div>

                      <StatusSwitch
                        checked={link.isActive}
                        pending={pending}
                        onToggle={() => toggleActive(link)}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                      <span className="rounded-full bg-surface px-2 py-1">
                        {link.mode === "FIXED" ? "Fixed" : "Variable"}
                      </span>
                      <span className="rounded-full bg-surface px-2 py-1">{formatAmount(link)}</span>
                      <span className="rounded-full bg-surface px-2 py-1">{formatDate(link.createdAt)}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:bg-white hover:text-foreground"
                        onClick={() => openPay(link)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Open
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:bg-white hover:text-foreground"
                        onClick={() => handleCopy(link)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted hover:bg-white hover:text-foreground"
                        onClick={() => openPayments(link)}
                      >
                        <ReceiptText className="h-3.5 w-3.5" />
                        Payments
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
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
                    const pending = isToggling(link.publicId);

                    return (
                      <tr
                        key={link.publicId}
                        className={
                          "text-xs text-foreground/90 transition-colors hover:bg-surface/60 " +
                          (isLast ? "" : "border-b border-border/60")
                        }
                      >
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
                          <StatusSwitch
                            checked={link.isActive}
                            pending={pending}
                            onToggle={() => toggleActive(link)}
                          />
                        </td>

                        <td className="px-4 py-3 align-top text-[11px] text-muted">
                          {formatDate(link.createdAt)}
                        </td>

                        <td className="px-4 py-3 align-top text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                              onClick={() => openPay(link)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Open</span>
                            </button>

                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                              onClick={() => handleCopy(link)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>

                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[11px] text-muted hover:bg-white hover:text-foreground"
                              onClick={() => openPayments(link)}
                            >
                              <ReceiptText className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Payments</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-2 text-[11px] text-muted">
                <span className={"h-1.5 w-1.5 rounded-full " + (isPending ? "bg-amber-400" : "bg-emerald-500")} />
                <span>{isPending ? "Syncing…" : "Up to date"}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="px-5 py-8 text-sm">
            <p className="font-medium tracking-[-0.01em]">No payment links yet</p>
            <p className="mt-2 text-sm text-muted">
              Create your first link. Your dashboard is currently in{" "}
              <span className="font-medium">{env === "LIVE" ? "Live" : "Test"}</span> mode.
            </p>

            <div className="mt-4">
              {canCreate ? (
                <CreatePaymentLinkButton size="sm" onCreated={handleCreated} />
              ) : (
                <Link href={onboardingHref}>
                  <Button size="sm">Complete setup</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ✅ Replaces the “analytics coming soon” block */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-4 text-xs text-muted md:flex-row md:items-center">
        <p>
          Tip: use <span className="font-medium text-foreground">Activity</span> to see recent payments and link events.
        </p>
        <Link href="/dashboard/activity">
          <Button size="sm" variant="secondary">
            Open activity
          </Button>
        </Link>
      </div>
    </div>
  );
}
