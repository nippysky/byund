// app/api/v2/keys/[id]/revoke/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id?: string }> }
) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;

  if (!auth.merchantId) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing key id" }, { status: 400 });
  }

  // revoke only if it belongs to merchant
  const updated = await prisma.apiKey.updateMany({
    where: { id, merchantId: auth.merchantId, status: "ACTIVE" },
    data: { status: "REVOKED", revokedAt: new Date() },
  });

  if (updated.count === 0) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  const res = NextResponse.json({ ok: true });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
