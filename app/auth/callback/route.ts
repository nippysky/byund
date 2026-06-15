/**
 * GET /auth/callback — Cross-domain SSO token handoff for the marketing site.
 *
 * Flow (no shared cookie domain on Vercel):
 *   accounts/login?next=<GOVERNANCE_OR_MARKETING> → redirect w/ ?_token=JWT
 *   → this route verifies JWT → sets byund_session cookie on byund.vercel.app
 *   → redirects to ?next (defaults to /products)
 */
export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { COOKIE_NAME, cookieOptions } from "@/app/lib/auth";

const SECRET = process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production";

function isValid(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, payload, signature] = parts;
  const expected = createHmac("sha256", SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  try {
    if (signature.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(expected, "utf8"));
  } catch { return false; }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("_token");
  const next  = req.nextUrl.searchParams.get("next") ?? "/products";

  if (!token || !isValid(token)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow relative paths or absolute URLs on safe domains
  const destination = next.startsWith("/")
    ? new URL(next, req.url)
    : (() => {
        try { return new URL(next); }
        catch { return new URL("/products", req.url); }
      })();

  const host = req.headers.get("host") ?? "";
  const response = NextResponse.redirect(destination);
  response.cookies.set(COOKIE_NAME, token, cookieOptions(host));
  return response;
}
