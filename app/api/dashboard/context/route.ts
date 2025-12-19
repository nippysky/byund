// app/api/dashboard/context/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth/require-api-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;

  // We need merchant info for mode + profile display
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      email: true,
      merchant: {
        select: {
          publicName: true,
          dashboardMode: true,
        },
      },
    },
  });

  if (!user || !user.merchant) {
    return NextResponse.json(
      { ok: false, error: "Merchant profile not found" },
      { status: 400 }
    );
  }

  const res = NextResponse.json({
    ok: true,
    mode: user.merchant.dashboardMode, // "TEST" | "LIVE"
    profile: {
      name: user.merchant.publicName,
      email: user.email,
    },
  });

  res.headers.set("Cache-Control", "no-store");
  return res;
}
