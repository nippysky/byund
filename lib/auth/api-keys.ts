// lib/auth/api-keys.ts
import "server-only";
import { randomBytes, createHash, timingSafeEqual } from "crypto";
import type { ApiKeyType, DashboardMode } from "@/lib/generated/prisma/client";

/**
 * Key formats:
 *  - byund_sk_live_<random>
 *  - byund_sk_test_<random>
 *  - byund_pk_live_<random>
 *  - byund_pk_test_<random>
 *
 * We store only SHA-256 hash in DB.
 */
export function makeApiKeyPlaintext(opts: { type: ApiKeyType; environment: DashboardMode }) {
  const kind = opts.type === "SECRET" ? "sk" : "pk";
  const env = opts.environment === "LIVE" ? "live" : "test";

  // base64url-ish string (safe in URLs/copy/paste)
  const rand = randomBytes(32).toString("base64url"); // Node 18+ supports base64url
  const key = `byund_${kind}_${env}_${rand}`;

  const prefix = `byund_${kind}_${env}`; // stable for UI + quick filtering
  const last4 = key.slice(-4);

  return { key, prefix, last4 };
}

export function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Optional: constant-time compare helper for any future secrets
 */
export function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
