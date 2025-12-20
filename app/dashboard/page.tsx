// app/dashboard/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import { CreatePaymentLinkButton } from "@/components/dashboard/CreatePaymentLinkButton";
import StatCard from "@/components/dashboard/StatCard";
import RecentActivityClient, { type ActivityRow } from "@/components/dashboard/RecentActivityClient";
import { requireAuth } from "@/lib/auth/require-auth";
import { prisma } from "@/lib/db";
import { CreditCard, Link2, TrendingUp } from "lucide-react";

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

export default async function DashboardHome() {
  noStore();

  const user = await requireAuth();

  const merchant = user.merchant ?? null;
  const merchantId = merchant?.id ?? null;

  if (!merchantId) {
    return (
      <div>
        <PageHeader
          title="Overview"
          description="Set up your merchant profile to start creating payment links."
          actions={<CreatePaymentLinkButton size="sm" />}
        />
        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">Merchant profile missing</p>
          <p className="mt-2 text-sm text-muted">
            Your account is signed in, but the merchant profile hasn’t been created yet.
            This will be auto-created during registration in V1.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Guard: if not onboarded, force onboarding
  if (!merchant?.settlementWallet) {
    redirect(`/onboarding?next=${encodeURIComponent("/dashboard")}`);
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
      where: { link: { merchantId }, status: "CONFIRMED" },
      _sum: { amountUsdCents: true },
    }),
    prisma.payment.count({
      where: { link: { merchantId }, status: "CONFIRMED" },
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
        link: { select: { name: true, publicId: true } },
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

  const activity: ActivityRow[] = [
    ...recentPayments.map((p) => ({
      kind: "payment" as const,
      id: p.id,
      at: p.createdAt.toISOString(),
      label: p.link?.name ?? "Payment",
      sublabel: `Payment ${formatUsdFromCents(p.amountUsdCents)}`,
      status: p.status as PaymentStatus,
      amountUsdCents: p.amountUsdCents,
      linkPublicId: p.link?.publicId ?? null,
    })),
    ...recentLinks.map((l) => ({
      kind: "link" as const,
      id: l.id,
      at: l.createdAt.toISOString(),
      label: l.name,
      sublabel: `/pay/${l.publicId}`,
      isActive: l.isActive,
      publicId: l.publicId,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 10);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="High-level view of your USD volumes, recent payments, and live status."
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

        <RecentActivityClient items={activity} />
      </div>
    </div>
  );
}
