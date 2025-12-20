// app/api/auth/register/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import {
  COOKIE_NAME,
  cookieOptions,
  hashToken,
  newSessionToken,
  sessionExpiry,
} from "@/lib/auth/session";

const RegisterSchema = z.object({
  name: z.string().min(1).max(80),
  email: z
    .string()
    .email()
    .transform((s) => s.toLowerCase().trim()),
  password: z.string().min(8).max(200),
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

export async function POST(req: Request) {
  try {
    await assertSameOrigin();

    const json = await req.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ ok: false, error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        merchant: {
          create: {
            publicName: name,
            settlementWallet: null,
          },
        },
      },
      select: {
        id: true,
        merchant: { select: { id: true } },
      },
    });

    const token = newSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = sessionExpiry();

    await prisma.session.create({
      data: { tokenHash, userId: user.id, expiresAt },
    });

    const res = NextResponse.json(
      { ok: true, merchantId: user.merchant?.id ?? null },
      { status: 201 }
    );

    res.cookies.set(COOKIE_NAME, token, cookieOptions(expiresAt));
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    console.error("REGISTER_ERROR:", e);
    return NextResponse.json({ ok: false, error: "Registration failed" }, { status: 500 });
  }
}
