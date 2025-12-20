// app/api/payment-links/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";
import type { DashboardMode } from "@/lib/generated/prisma/client";

const CreateSchema = z.object({
  name: z.string().min(1).max(120),
  mode: z.enum(["FIXED", "VARIABLE"]),
  amount: z.string().nullable().optional(),
  description: z.string().max(280).nullable().optional(),
  isActive: z.boolean().optional(),
});

function assertSameOrigin(req: Request) {
  if (process.env.NODE_ENV !== "production") return;

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) throw new Error("Bad origin");

  const originHost = new URL(origin).host;
  if (originHost !== host) throw new Error("Bad origin");
}

function base62FromBytes(bytes: Buffer) {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let num = BigInt("0x" + bytes.toString("hex"));
  let out = "";
  while (num > BigInt(0)) {
    const rem = Number(num % BigInt(62));
    out = alphabet[rem] + out;
    num = num / BigInt(62);
  }
  return out || "0";
}

function makePublicId(length = 12) {
  const bytes = crypto.randomBytes(9);
  const id = base62FromBytes(bytes);
  return id.slice(0, length);
}

function parseUsdToCents(input: string) {
  const raw = input.trim();
  if (!/^\d+(\.\d{0,2})?$/.test(raw)) throw new Error("Invalid amount format");

  const [intPart, decPart = ""] = raw.split(".");
  const dollars = Number(intPart);
  if (!Number.isFinite(dollars)) throw new Error("Invalid amount");

  const cents = Number((decPart + "00").slice(0, 2));
  const total = dollars * 100 + cents;

  if (!Number.isFinite(total) || total <= 0) throw new Error("Amount must be greater than 0");
  if (total > 2_000_000_00) throw new Error("Amount is too large");

  return total;
}

function hasValidSettlementWallet(wallet: unknown) {
  if (typeof wallet !== "string") return false;
  const w = wallet.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(w);
}

const V1_ENV: DashboardMode = "LIVE";

export async function GET() {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;

  if (!auth.merchantId) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  const links = await prisma.paymentLink.findMany({
    where: { merchantId: auth.merchantId, environment: V1_ENV },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      publicId: true,
      name: true,
      mode: true,
      fixedAmountCents: true,
      isActive: true,
      environment: true,
      description: true,
      createdAt: true,
    },
  });

  const res = NextResponse.json({
    ok: true,
    env: V1_ENV,
    links: links.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);

    const auth = await requireApiAuth();
    if (!auth.ok) return auth.res;

    if (!auth.merchantId) {
      return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
    }

    // ✅ HARD GATE: must have settlement wallet before creating links
    const merchant = await prisma.merchant.findUnique({
      where: { id: auth.merchantId },
      select: { settlementWallet: true },
    });

    if (!hasValidSettlementWallet(merchant?.settlementWallet)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Set your settlement wallet before creating payment links.",
        },
        { status: 403 }
      );
    }

    const json = await req.json().catch(() => null);
    const body = CreateSchema.parse(json);

    const fixedAmountCents =
      body.mode === "FIXED" ? parseUsdToCents(body.amount ?? "") : null;

    let publicId = makePublicId(12);
    for (let i = 0; i < 3; i++) {
      const exists = await prisma.paymentLink.findUnique({
        where: { publicId },
        select: { id: true },
      });
      if (!exists) break;
      publicId = makePublicId(12);
    }

    const created = await prisma.paymentLink.create({
      data: {
        merchantId: auth.merchantId,
        environment: V1_ENV,
        publicId,
        name: body.name,
        description: body.description ?? null,
        mode: body.mode,
        fixedAmountCents,
        isActive: body.isActive ?? true,
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        mode: true,
        fixedAmountCents: true,
        isActive: true,
        environment: true,
        description: true,
        createdAt: true,
      },
    });

    const res = NextResponse.json({
      ok: true,
      link: { ...created, createdAt: created.createdAt.toISOString() },
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    const message =
      e instanceof z.ZodError
        ? e.issues[0]?.message ?? "Invalid request"
        : e instanceof Error
        ? e.message
        : "Request failed";

    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
