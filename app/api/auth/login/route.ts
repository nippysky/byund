import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  COOKIE_NAME,
  cookieOptions,
  hashToken,
  newSessionToken,
  sessionExpiry,
} from "@/lib/auth/session";

const LoginSchema = z.object({
  email: z.email().transform((s) => s.toLowerCase().trim()),
  password: z.string().min(1).max(200),
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
    const parsed = LoginSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
        merchant: { select: { settlementWallet: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Decide onboarding requirement
    const wallet = user.merchant?.settlementWallet?.trim() ?? "";
    const onboardingRequired = !user.merchant || wallet.length === 0;

    // rotate sessions (optional but good)
    await prisma.session.deleteMany({ where: { userId: user.id } });

    const token = newSessionToken();
    const tokenHash = hashToken(token);
    const expiresAt = sessionExpiry();

    await prisma.session.create({ data: { tokenHash, userId: user.id, expiresAt } });

    const res = NextResponse.json({ ok: true, onboardingRequired });
    res.cookies.set(COOKIE_NAME, token, cookieOptions(expiresAt));
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Login failed" }, { status: 500 });
  }
}
