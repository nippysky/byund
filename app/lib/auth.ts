/**
 * Marketing site auth — JWT verification using Node built-in crypto.
 * No extra deps needed; uses same HS256 secret as accounts + governance.
 */
export const runtime = "nodejs";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "byund_session";
const SECRET = process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production";

export interface MarketingSession {
  userId:      string;
  name:        string;
  email:       string;
  workspaceId: string;
  role:        string;
}

/** HS256 verification without jose — same result, no extra dep. */
function verifyHS256(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  const expected = createHmac("sha256", SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  try {
    if (signature.length !== expected.length) return null;
    if (!timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(expected, "utf8"))) return null;
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<MarketingSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const data = verifyHS256(token);
  if (!data) return null;
  const userId = (data.userId ?? data.sub) as string;
  if (!userId) return null;
  return {
    userId,
    name:        (data.name        as string) ?? "",
    email:       (data.email       as string) ?? "",
    workspaceId: (data.workspaceId as string) ?? "",
    role:        (data.role        as string) ?? "VIEWER",
  };
}

/** Set the session cookie — call from route handlers. */
export function cookieOptions(host: string) {
  const isCustomDomain = host === "byund.com" || host.endsWith(".byund.com");
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure:   isProd || isCustomDomain,
    sameSite: "lax" as const,
    domain:   isCustomDomain ? ".byund.com" : undefined,
    path:     "/",
    maxAge:   7 * 24 * 60 * 60,
  };
}
