// app/api/dashboard/context/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/require-api-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      email: true,
      merchant: {
        select: {
          id: true,
          publicName: true,
          settlementWallet: true, // useful for onboarding gating
        },
      },
    },
  });

  if (!user || !user.merchant) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  const res = NextResponse.json({
    ok: true,
    merchantId: user.merchant.id,
    profile: {
      name: user.merchant.publicName,
      email: user.email,
    },
    // UI can gently nudge onboarding based on this
    isOnboarded: Boolean(user.merchant.settlementWallet),
  });

  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
