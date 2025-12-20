// app/dashboard/settings/branding/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import PageHeader from "@/components/dashboard/PageHeader";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/require-auth";
import BrandingSettingsCard from "@/components/dashboard/settings/BrandingSettingsCard";

const BYUND_BLUE = "#0066ff";
const BYUND_WHITE = "#ffffff";

export default async function BrandingSettingsPage() {
  noStore();

  const auth = await requireAuth();
  const merchantId = auth.merchant?.id;

  if (!merchantId) {
    return (
      <div>
        <PageHeader
          title="Settings"
          description="Configure your business profile, settlement wallet, and developer settings."
        />
        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">Merchant profile not found</p>
          <p className="mt-2 text-sm text-muted">
            Please finish onboarding in Settings (public name, settlement wallet).
          </p>
        </div>
      </div>
    );
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: { brandBg: true, brandText: true },
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="Configure your business profile, settlement wallet, and developer settings."
      />

      <BrandingSettingsCard
        initial={{
          brandBg: merchant?.brandBg ?? BYUND_BLUE,
          brandText: merchant?.brandText ?? BYUND_WHITE,
        }}
      />
    </div>
  );
}
