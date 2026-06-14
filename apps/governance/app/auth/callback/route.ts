/**
 * GET /auth/callback — Cross-domain SSO token handoff.
 *
 * MUST be a Route Handler (not a Server Component) because
 * cookies().set() only works in Route Handlers and Server Actions.
 *
 * Flow:
 *   accounts.byund.com/login  →  byund-governance.vercel.app/auth/callback?_token=JWT
 *   → verify JWT → set byund_session cookie → redirect to dashboard
 */
import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "byund_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("_token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, SECRET);
  } catch {
    // Invalid or expired token
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  const isProd = process.env.NODE_ENV === "production";

  // Build redirect to dashboard with cookie attached
  const response = NextResponse.redirect(new URL("/", req.url));

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   isProd,
    sameSite: isProd ? "none" : "lax",
    domain:   isProd ? ".byund.com" : undefined,
    path:     "/",
    maxAge:   7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
