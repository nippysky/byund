export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";

const BodySchema = z.object({
  isActive: z.boolean(),
  environment: z.enum(["TEST", "LIVE"]),
});

async function assertSameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");

  if (process.env.NODE_ENV === "production") {
    if (!origin || !host) throw new Error("Bad origin");
    const originHost = new URL(origin).host;
    if (originHost !== host) throw new Error("Bad origin");
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ publicId?: string }> }
) {
  try {
    await assertSameOrigin();

    const auth = await requireApiAuth();
    // ✅ requireApiAuth returns merchantId (not merchant object)
    const merchantId = auth.merchantId;

    if (!merchantId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { publicId } = await context.params;
    if (!publicId) {
      return NextResponse.json({ ok: false, error: "Missing publicId" }, { status: 400 });
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const { isActive, environment } = parsed.data;

    const updated = await prisma.paymentLink.updateMany({
      where: { merchantId, publicId, environment },
      data: { isActive },
    });

    if (updated.count === 0) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    const res = NextResponse.json({ ok: true, isActive });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
