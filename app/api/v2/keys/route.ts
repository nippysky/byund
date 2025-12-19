// app/api/v2/keys/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireApiAuth } from "@/lib/auth/require-api-auth";
import { makeApiKeyPlaintext, hashApiKey } from "@/lib/auth/api-keys";
import type { ApiKeyType, DashboardMode } from "@/lib/generated/prisma/client";

const CreateKeySchema = z.object({
  environment: z.enum(["TEST", "LIVE"]),
  type: z.enum(["SECRET", "PUBLISHABLE"]),
  name: z.string().min(1).max(80).optional(),
});

const ListQuerySchema = z.object({
  environment: z.enum(["TEST", "LIVE"]).optional(),
  type: z.enum(["SECRET", "PUBLISHABLE"]).optional(),
});

export async function GET(req: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;

  if (!auth.merchantId) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  const url = new URL(req.url);
  const parsed = ListQuerySchema.safeParse({
    environment: url.searchParams.get("environment") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid query" }, { status: 400 });
  }

  const where: {
    merchantId: string;
    environment?: DashboardMode;
    type?: ApiKeyType;
  } = { merchantId: auth.merchantId };

  if (parsed.data.environment) where.environment = parsed.data.environment;
  if (parsed.data.type) where.type = parsed.data.type;

  const keys = await prisma.apiKey.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      environment: true,
      type: true,
      name: true,
      prefix: true,
      last4: true,
      status: true,
      createdAt: true,
      revokedAt: true,
    },
  });

  const res = NextResponse.json({
    ok: true,
    keys: keys.map((k) => ({
      ...k,
      createdAt: k.createdAt.toISOString(),
      revokedAt: k.revokedAt ? k.revokedAt.toISOString() : null,
    })),
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: Request) {
  const auth = await requireApiAuth();
  if (!auth.ok) return auth.res;

  if (!auth.merchantId) {
    return NextResponse.json({ ok: false, error: "Merchant profile not found" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateKeySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  const environment = parsed.data.environment as DashboardMode;
  const type = parsed.data.type as ApiKeyType;

  const { key, prefix, last4 } = makeApiKeyPlaintext({ environment, type });
  const keyHash = hashApiKey(key);

  // Ensure uniqueness (extremely unlikely collision, but handle nicely)
  try {
    const created = await prisma.apiKey.create({
      data: {
        merchantId: auth.merchantId,
        environment,
        type,
        name: parsed.data.name?.trim() || null,
        keyHash,
        prefix,
        last4,
        // scopes empty by default; add later when you need it
      },
      select: {
        id: true,
        environment: true,
        type: true,
        name: true,
        prefix: true,
        last4: true,
        status: true,
        createdAt: true,
      },
    });

    // Return plaintext key ONCE (store it client-side for copying)
    const res = NextResponse.json({
      ok: true,
      key, // plaintext (show once)
      apiKey: { ...created, createdAt: created.createdAt.toISOString() },
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ ok: false, error: "Could not create key" }, { status: 500 });
  }
}
