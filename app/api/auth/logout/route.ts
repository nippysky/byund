// app/api/auth/logout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, cookieOptions, hashToken } from "@/lib/auth/session";

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

export async function POST() {
  try {
    await assertSameOrigin();

    const jar = await cookies();
    const token = jar.get(COOKIE_NAME)?.value;

    if (token) {
      await prisma.session.deleteMany({
        where: { tokenHash: hashToken(token) },
      });
    }

    const res = NextResponse.json({ ok: true });

    // Delete cookie using the same option-shape as set (important for __Host- cookies in prod)
    res.cookies.set(COOKIE_NAME, "", {
      ...cookieOptions(new Date(0)),
      expires: new Date(0),
      maxAge: 0,
    });

    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Logout failed" }, { status: 500 });
  }
}
