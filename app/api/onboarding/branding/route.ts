export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";

const hex = z.string().trim().regex(/^#([0-9a-fA-F]{6})$/, "Use a hex color like #0066FF");

const Schema = z.object({
  brandBg: hex,
  brandText: hex,
});

export async function POST(req: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;
  if (!auth.merchantId) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  try {
    const json = await req.json().catch(() => null);
    const body = Schema.parse(json);

    await prisma.$transaction(async (tx) => {
      const m = await tx.merchant.findUnique({
        where: { id: auth.merchantId! },
        select: { onboardingStep: true },
      });
      const nextStep = Math.max(m?.onboardingStep ?? 0, 3);

      await tx.merchant.update({
        where: { id: auth.merchantId! },
        data: {
          brandBg: body.brandBg,
          brandText: body.brandText,
          onboardingStep: nextStep,
        },
      });
    });

    const res = NextResponse.json({ ok: true });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    const msg =
      e instanceof z.ZodError ? e.issues[0]?.message ?? "Invalid input" : "Request failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
