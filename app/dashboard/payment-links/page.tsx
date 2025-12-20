// app/dashboard/payment-links/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import PageHeader from "@/components/dashboard/PageHeader";
import PaymentLinksClient from "@/components/dashboard/PaymentLinksClient";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/require-auth";
import type { DashboardMode, PaymentLinkMode } from "@/lib/generated/prisma/client";

type LinkRow = {
  id: string;
  publicId: string;
  name: string;
  mode: PaymentLinkMode;
  fixedAmountCents: number | null;
  isActive: boolean;
  environment: DashboardMode;
  createdAt: string; // ISO
};

export default async function PaymentLinksPage() {
  noStore();

  const auth = await requireAuth();

  const merchantId = auth.merchant?.id;
  if (!merchantId) {
    return (
      <div>
        <PageHeader
          title="Payment links"
          description="Create, manage, and track USD payment links for invoices and products."
        />
        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">Merchant profile not found</p>
          <p className="mt-2 text-sm text-muted">
            Please finish onboarding in Settings (public name, settlement wallet), then return here.
          </p>
        </div>
      </div>
    );
  }

  // V1 decision: dashboard always operates in LIVE environment
  const env: DashboardMode = "LIVE";

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { settlementWallet: true },
  });

  const canCreate = Boolean(merchant?.settlementWallet);

  const links = await prisma.paymentLink.findMany({
    where: { merchantId, environment: env },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      publicId: true,
      name: true,
      mode: true,
      fixedAmountCents: true,
      isActive: true,
      environment: true,
      createdAt: true,
    },
  });

  const initialLinks: LinkRow[] = links.map((l) => ({
    id: l.id,
    publicId: l.publicId,
    name: l.name,
    mode: l.mode,
    fixedAmountCents: l.fixedAmountCents,
    isActive: l.isActive,
    environment: l.environment,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Payment links"
        description="Create, manage, and track USD payment links for invoices and products."
      />

      <PaymentLinksClient
        env={env}
        initialLinks={initialLinks}
        canCreate={canCreate}
        onboardingHref={`/onboarding?next=${encodeURIComponent("/dashboard/payment-links")}`}
      />
    </div>
  );
}
