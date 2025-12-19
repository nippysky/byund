// app/dashboard/page.tsx
export const dynamic = "force-dynamic";

import PageHeader from "@/components/dashboard/PageHeader";
import { CreatePaymentLinkButton } from "@/components/dashboard/CreatePaymentLinkButton";
import StatCard from "@/components/dashboard/StatCard";
import { requireAuth } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/db";
import { CreditCard, Link2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

function formatUsdFromCents(cents: number) {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type PaymentStatus = "CONFIRMED" | "SUBMITTED" | "CREATED" | "FAILED" | "CANCELED";

type ActivityItem =
  | {
      kind: "payment";
      id: string;
      at: Date;
      label: string;
      sublabel: string;
      status: PaymentStatus;
      amountUsdCents: number;
    }
  | {
      kind: "link";
      id: string;
      at: Date;
      label: string;
      sublabel: string;
      isActive: boolean;
    };

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
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tone
      )}
    >
      {label}
    </span>
  );
}

function LinkStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-border bg-surface text-muted"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-border"
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function formatWhen(d: Date) {
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardHome() {
  const user = await requireAuth();

  const merchantId = user.merchant?.id ?? null;

  if (!merchantId) {
    return (
      <div>
        <PageHeader
          title="Overview"
          description="Set up your merchant profile to start creating payment links."
          actions={<CreatePaymentLinkButton size="sm" />}
        />
        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">
            Merchant profile missing
          </p>
          <p className="mt-2 text-sm text-muted">
            Your account is signed in, but the merchant profile hasn’t been created yet.
            This will be auto-created during registration in V1.
          </p>
        </div>
      </div>
    );
  }

  const [
    activeLinksCount,
    totalLinksCount,
    confirmedPaymentsAgg,
    confirmedPaymentsCount,
    recentPayments,
    recentLinks,
  ] = await Promise.all([
    prisma.paymentLink.count({ where: { merchantId, isActive: true } }),
    prisma.paymentLink.count({ where: { merchantId } }),
    prisma.payment.aggregate({
      where: {
        link: { merchantId },
        status: "CONFIRMED",
      },
      _sum: { amountUsdCents: true },
    }),
    prisma.payment.count({
      where: {
        link: { merchantId },
        status: "CONFIRMED",
      },
    }),
    prisma.payment.findMany({
      where: { link: { merchantId } },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        createdAt: true,
        status: true,
        amountUsdCents: true,
        link: { select: { name: true } },
      },
    }),
    prisma.paymentLink.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        publicId: true,
        name: true,
        createdAt: true,
        isActive: true,
      },
    }),
  ]);

  const totalProcessedCents = confirmedPaymentsAgg._sum.amountUsdCents ?? 0;

  const activity: ActivityItem[] = [
    ...recentPayments.map((p) => ({
      kind: "payment" as const,
      id: p.id,
      at: p.createdAt,
      label: p.link?.name ?? "Payment",
      sublabel: `Payment ${formatUsdFromCents(p.amountUsdCents)}`,
      status: p.status as PaymentStatus,
      amountUsdCents: p.amountUsdCents,
    })),
    ...recentLinks.map((l) => ({
      kind: "link" as const,
      id: l.id,
      at: l.createdAt,
      label: l.name,
      sublabel: `/pay/${l.publicId}`,
      isActive: l.isActive,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="High-level view of your USD volumes, recent payments, and live status. This is the starting point for V1."
        actions={<CreatePaymentLinkButton size="sm" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total processed (USD)"
          value={formatUsdFromCents(totalProcessedCents)}
          hint="Confirmed payments only."
          icon={<TrendingUp className="h-4 w-4" />}
          tone={totalProcessedCents > 0 ? "good" : "default"}
        />

        <StatCard
          label="Successful payments"
          value={confirmedPaymentsCount.toLocaleString("en-US")}
          hint="Conversions that reached confirmed."
          icon={<CreditCard className="h-4 w-4" />}
          tone={confirmedPaymentsCount > 0 ? "good" : "default"}
        />

        <StatCard
          label="Active links"
          value={activeLinksCount.toLocaleString("en-US")}
          hint={`${totalLinksCount.toLocaleString("en-US")} total created`}
          icon={<Link2 className="h-4 w-4" />}
          tone={activeLinksCount > 0 ? "warn" : "default"}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium tracking-[-0.01em]">Recent activity</p>
          <p className="text-[11px] text-muted">Latest 10 events</p>
        </div>

        {activity.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/40 px-4 py-5">
            <p className="text-sm font-medium tracking-[-0.01em]">Nothing yet</p>
            <p className="mt-1 text-sm text-muted">
              When your first payments arrive, you’ll see a timeline here: link created,
              payment submitted, confirmed, and settlement events.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {activity.map((item) => (
              <div
                key={`${item.kind}_${item.id}`}
                className="flex items-start justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-muted">
                    {item.sublabel}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {formatWhen(item.at)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {item.kind === "payment" ? (
                    <>
                      <span className="hidden text-[12px] font-medium text-foreground sm:inline">
                        {formatUsdFromCents(item.amountUsdCents)}
                      </span>
                      <PaymentStatusBadge status={item.status} />
                    </>
                  ) : (
                    <LinkStatusBadge isActive={item.isActive} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
