export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";

const BodySchema = z.object({
  publicName: z.string().min(2).max(80),
});

async function assertSameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");

  if (process.env.NODE_ENV === "production") {
    if (!origin || !host) throw new Error("Bad origin");
    if (new URL(origin).host !== host) throw new Error("Bad origin");
  }
}

export async function POST(req: Request) {
  try {
    await assertSameOrigin();

    const auth = await requireApiAuth();
    if (!auth.ok) return auth.res;

    if (!auth.merchantId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    await prisma.merchant.update({
      where: { id: auth.merchantId },
      data: { publicName: parsed.data.publicName.trim() },
    });

    const res = NextResponse.json({ ok: true });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
