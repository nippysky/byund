// lib/auth/require-api-auth.ts
import "server-only";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, hashToken } from "@/lib/auth/session";

export async function requireApiAuth() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;

  if (!token) {
    return {
      ok: false as const,
      res: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: {
      expiresAt: true,
      userId: true,
      user: {
        select: {
          merchant: { select: { id: true } },
        },
      },
    },
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    return {
      ok: false as const,
      res: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  const merchantId = session.user.merchant?.id ?? null;

  return {
    ok: true as const,
    userId: session.userId,
    merchantId,
  };
}
