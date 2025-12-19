// app/api/dashboard/mode/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";

const BodySchema = z.object({
  mode: z.enum(["TEST", "LIVE"]),
});

async function assertSameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");

  // Only enforce strictly in production
  if (process.env.NODE_ENV === "production") {
    if (!origin || !host) throw new Error("Bad origin");
    const originHost = new URL(origin).host;
    if (originHost !== host) throw new Error("Bad origin");
  }
}

export async function POST(req: Request) {
  try {
    await assertSameOrigin();

    const auth = await requireApiAuth();
    if (!auth.ok) return auth.res;

    if (!auth.merchantId) {
      return NextResponse.json(
        { ok: false, error: "Merchant profile not found" },
        { status: 400 }
      );
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const updated = await prisma.merchant.update({
      where: { id: auth.merchantId },
      data: { dashboardMode: parsed.data.mode },
      select: { dashboardMode: true, updatedAt: true },
    });

    const res = NextResponse.json({ ok: true, mode: updated.dashboardMode });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to update mode" },
      { status: 500 }
    );
  }
}
