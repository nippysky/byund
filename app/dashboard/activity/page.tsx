// app/dashboard/activity/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import PageHeader from "@/components/dashboard/PageHeader";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/require-auth";
import type { DashboardMode, PaymentStatus } from "@/lib/generated/prisma/client";

type SearchParams = Record<string, string | string[] | undefined>;

type ActivityRow = {
  id: string;
  status: PaymentStatus;
  amountUsdCents: number;
  linkPublicId: string;
  linkName: string;
  createdAtIso: string;
};

function formatMoneyUsd(cents: number) {
  const n = cents / 100;
  return `USD ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateWAT(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    timeZone: "Africa/Lagos",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

function statusPill(status: PaymentStatus) {
  switch (status) {
    case "CONFIRMED":
      return { label: "Confirmed", dot: "bg-emerald-500" };
    case "SUBMITTED":
      return { label: "Submitted", dot: "bg-amber-400" };
    case "CREATED":
      return { label: "Created", dot: "bg-border" };
    case "FAILED":
      return { label: "Failed", dot: "bg-red-500" };
    case "CANCELED":
      return { label: "Canceled", dot: "bg-red-500" };
    default:
      return { label: String(status), dot: "bg-border" };
  }
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  noStore();

  const sp = (await searchParams) ?? {};
  const rawLink = sp.link;
  const linkPublicId = Array.isArray(rawLink) ? rawLink[0] : rawLink;
  const linkFilter =
    typeof linkPublicId === "string" && linkPublicId.trim() ? linkPublicId.trim() : null;

  const auth = await requireAuth();
  const merchantId = auth.merchant?.id;

  if (!merchantId) {
    return (
      <div>
        <PageHeader
          title="Activity"
          description="A chronological log of payments, settlements, and webhook deliveries."
        />
        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">Merchant profile not found</p>
          <p className="mt-2 text-sm text-muted">
            Please finish onboarding in Settings, then return here.
          </p>
        </div>
      </div>
    );
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { dashboardMode: true },
  });

  const env: DashboardMode = merchant?.dashboardMode ?? "TEST";

  // Payments are tied to PaymentLink via `link`, so filter via link.merchantId + link.environment
  const payments = await prisma.payment.findMany({
    where: {
      link: {
        merchantId,
        environment: env,
        ...(linkFilter ? { publicId: linkFilter } : {}),
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      status: true,
      amountUsdCents: true,
      createdAt: true,
      link: { select: { publicId: true, name: true } },
    },
  });

  const rows: ActivityRow[] = payments.map((p) => ({
    id: p.id,
    status: p.status,
    amountUsdCents: p.amountUsdCents,
    linkPublicId: p.link.publicId,
    linkName: p.link.name,
    createdAtIso: p.createdAt.toISOString(),
  }));

  const hasRows = rows.length > 0;

  return (
    <div>
      <PageHeader
        title="Activity"
        description="A chronological log of payments, settlements, and webhook deliveries."
      />

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="rounded-full border border-border bg-white px-2 py-1">
            <span className="font-medium text-foreground">{env === "LIVE" ? "Live" : "Test"}</span>{" "}
            mode
          </span>

          {linkFilter ? (
            <span className="rounded-full bg-surface px-2 py-1">
              Filter: <span className="font-medium text-foreground">/pay/{linkFilter}</span>
            </span>
          ) : null}
        </div>

        {linkFilter ? (
          <Link
            href="/dashboard/activity"
            className="rounded-full border border-border bg-white px-3 py-1 text-[11px] text-muted hover:bg-surface hover:text-foreground"
          >
            Clear filter
          </Link>
        ) : (
          <Link
            href="/dashboard/payment-links"
            className="rounded-full border border-border bg-white px-3 py-1 text-[11px] text-muted hover:bg-surface hover:text-foreground"
          >
            View payment links
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-white p-0 shadow-[0_8px_25px_rgba(15,17,21,0.06)]">
        {hasRows ? (
          <>
            {/* Mobile cards */}
            <div className="divide-y divide-border md:hidden">
              {rows.map((r) => {
                const pill = statusPill(r.status);

                return (
                  <div key={r.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-foreground">
                          {r.linkName}
                        </p>
                        <p className="mt-1 truncate font-mono text-[11px] text-muted">
                          /pay/{r.linkPublicId}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-[11px] text-foreground">
                        <span className={"h-1.5 w-1.5 rounded-full " + pill.dot} />
                        {pill.label}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                      <span className="rounded-full bg-surface px-2 py-1">
                        {formatMoneyUsd(r.amountUsdCents)}
                      </span>
                      <span className="rounded-full bg-surface px-2 py-1">
                        {formatDateWAT(r.createdAtIso)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="min-w-full border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="border-b border-border/70 bg-surface/60 text-[11px] uppercase tracking-[0.16em] text-muted">
                    <th className="px-4 py-3 text-left font-medium">Link</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Time (WAT)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const isLast = idx === rows.length - 1;
                    const pill = statusPill(r.status);

                    return (
                      <tr
                        key={r.id}
                        className={
                          "text-xs text-foreground/90 transition-colors hover:bg-surface/60 " +
                          (isLast ? "" : "border-b border-border/60")
                        }
                      >
                        <td className="max-w-lg px-4 py-3 align-top">
                          <div className="space-y-0.5">
                            <p className="truncate text-[13px] font-medium tracking-[-0.01em]">
                              {r.linkName}
                            </p>
                            <p className="truncate font-mono text-[11px] text-muted">
                              /pay/{r.linkPublicId}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top text-[13px]">
                          {formatMoneyUsd(r.amountUsdCents)}
                        </td>

                        <td className="px-4 py-3 align-top">
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground">
                            <span className={"h-1.5 w-1.5 rounded-full " + pill.dot} />
                            {pill.label}
                          </span>
                        </td>

                        <td className="px-4 py-3 align-top text-[11px] text-muted">
                          {formatDateWAT(r.createdAtIso)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-4 md:p-6">
            <p className="text-sm font-medium tracking-[-0.01em]">Nothing to see yet</p>
            <p className="mt-2 text-sm text-muted">
              As soon as payments start flowing through BYUND, they&apos;ll appear here with statuses like{" "}
              <strong>created</strong>, <strong>submitted</strong>, and <strong>confirmed</strong>.
            </p>

            {linkFilter ? (
              <p className="mt-2 text-sm text-muted">
                You’re currently filtering by <span className="font-medium">/pay/{linkFilter}</span>.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
