export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";

export async function POST() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;
  if (!auth.merchantId) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  await prisma.merchant.update({
    where: { id: auth.merchantId },
    data: { onboardingCompletedAt: new Date(), onboardingStep: 3 },
  });

  const res = NextResponse.json({ ok: true });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
