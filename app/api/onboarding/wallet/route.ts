export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";
import { isAddress, getAddress } from "viem";

const Schema = z.object({
  settlementWallet: z.string().trim().min(1),
});

function validateWalletAddress(input: string) {
  const s = input.trim();
  if (!isAddress(s)) return { ok: false as const, error: "Enter a valid EVM address." };
  const checksummed = getAddress(s);

  // avoid obvious foot-guns
  if (checksummed.toLowerCase() === "0x0000000000000000000000000000000000000000") {
    return { ok: false as const, error: "Zero address can’t receive funds." };
  }

  return { ok: true as const, value: checksummed };
}

export async function POST(req: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;
  if (!auth.merchantId) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  try {
    const json = await req.json().catch(() => null);
    const body = Schema.parse(json);

    const v = validateWalletAddress(body.settlementWallet);
    if (!v.ok) {
      return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const m = await tx.merchant.findUnique({
        where: { id: auth.merchantId! },
        select: { onboardingStep: true },
      });
      const nextStep = Math.max(m?.onboardingStep ?? 0, 2);

      await tx.merchant.update({
        where: { id: auth.merchantId! },
        data: {
          settlementWallet: v.value,
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
