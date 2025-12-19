// lib/auth/require-api-key-auth.ts
import "server-only";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashApiKey } from "@/lib/auth/api-keys";
import type { ApiKeyType, DashboardMode } from "@/lib/generated/prisma/client";

export type ApiKeyAuthOk = {
  ok: true;
  merchantId: string;
  environment: DashboardMode;
  keyType: ApiKeyType;
  scopes: string[];
  apiKeyId: string;
};

export type ApiKeyAuthFail = {
  ok: false;
  res: NextResponse;
};

function unauthorized() {
  return {
    ok: false as const,
    res: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
  };
}

function parseBearer(req: Request): string | null {
  const raw = req.headers.get("authorization") ?? "";
  const [scheme, ...rest] = raw.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer") return null;
  const token = rest.join(" ").trim();
  return token ? token : null;
}

/**
 * Require a valid API key (Bearer).
 * - Looks up sha256(token) in ApiKey table
 * - Ensures status ACTIVE and not revoked
 * - Optionally restricts allowed key types / required scopes
 */
export async function requireApiKeyAuth(
  req: Request,
  opts?: { allowTypes?: ApiKeyType[]; requireScopes?: string[] }
): Promise<ApiKeyAuthOk | ApiKeyAuthFail> {
  const token = parseBearer(req);
  if (!token) return unauthorized();

  const keyHash = hashApiKey(token);

  const rec = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: {
      id: true,
      merchantId: true,
      environment: true,
      type: true,
      scopes: true,
      status: true,
      revokedAt: true,
    },
  });

  if (!rec) return unauthorized();
  if (rec.status !== "ACTIVE") return unauthorized();
  if (rec.revokedAt) return unauthorized();

  if (opts?.allowTypes?.length && !opts.allowTypes.includes(rec.type)) {
    return {
      ok: false as const,
      res: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }),
    };
  }

  if (opts?.requireScopes?.length) {
    const have = new Set(rec.scopes ?? []);
    const missing = opts.requireScopes.filter((s) => !have.has(s));
    if (missing.length) {
      return {
        ok: false as const,
        res: NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 }),
      };
    }
  }

  return {
    ok: true as const,
    apiKeyId: rec.id,
    merchantId: rec.merchantId,
    environment: rec.environment,
    keyType: rec.type,
    scopes: rec.scopes ?? [],
  };
}
