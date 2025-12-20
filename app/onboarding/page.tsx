// app/onboarding/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/require-auth";
import OnboardingClient from "@/components/onboarding/OnboardingClient";

function safeNextPath(raw: unknown) {
  if (typeof raw !== "string" || !raw) return "/dashboard";
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  return raw;
}

function computeInitialStep(m: {
  publicName: string | null;
  settlementWallet: string | null;
  onboardingStep: number;
  onboardingCompletedAt: Date | null;
}) {
  if (m.onboardingCompletedAt) return 3; // done screen (or you could redirect earlier)
  // Hard requirements ordering:
  if (!m.publicName || m.publicName.trim().length < 2) return 0;
  if (!m.settlementWallet) return 1;

  // Resume whatever step they were on (but never go backwards once wallet exists)
  return Math.max(2, Math.min(3, m.onboardingStep || 0));
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  noStore();

  const auth = await requireAuth();
  const merchantId = auth.merchant?.id;

  if (!merchantId) {
    redirect("/dashboard/settings/profile");
  }

  const sp = await searchParams;
  const rawNext = sp?.next;
  const nextValue = Array.isArray(rawNext) ? rawNext[0] : rawNext;
  const nextPath = safeNextPath(nextValue);

  const merchant = await prisma.merchant.findUnique({
    where: { id: merchantId },
    select: {
      id: true,
      publicName: true,
      settlementWallet: true,
      brandBg: true,
      brandText: true,
      onboardingStep: true,
      onboardingCompletedAt: true,
      user: { select: { email: true } },
    },
  });

  if (!merchant) redirect("/dashboard");

  // ✅ Redirect ONLY when onboarding is explicitly completed
  if (merchant.onboardingCompletedAt) {
    redirect(nextPath);
  }

  const initialStep = computeInitialStep({
    publicName: merchant.publicName,
    settlementWallet: merchant.settlementWallet,
    onboardingStep: merchant.onboardingStep ?? 0,
    onboardingCompletedAt: merchant.onboardingCompletedAt ?? null,
  });

  return (
    <OnboardingClient
      nextPath={nextPath}
      initialStep={initialStep}
      initial={{
        publicName: merchant.publicName ?? "",
        email: merchant.user?.email ?? "",
        settlementWallet: merchant.settlementWallet ?? "",
        brandBg: merchant.brandBg ?? "#0066FF",
        brandText: merchant.brandText ?? "#FFFFFF",
      }}
    />
  );
}
