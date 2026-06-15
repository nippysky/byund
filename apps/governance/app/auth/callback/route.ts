/**
 * GET /auth/callback — Cross-domain SSO token handoff.
 *
 * MUST be a Route Handler (not a Server Component) — cookies().set()
 * only works in Route Handlers and Server Actions.
 *
 * Flow:
 *   byund-accounts.vercel.app/login?next=<this url>
 *   → governance/auth/callback?_token=JWT
 *   → verify → set byund_session cookie → redirect to dashboard
 *
 * Cookie domain rule:
 *   - On *.byund.com custom domains  → Domain=.byund.com (shared SSO cookie)
 *   - On *.vercel.app / localhost     → NO domain attribute (browser binds to exact host)
 *   Setting Domain=.byund.com on a vercel.app origin causes silent cookie rejection.
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
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  // Only set Domain=.byund.com when actually on a .byund.com host.
  // On vercel.app or localhost, omit domain entirely so the browser accepts it.
  const host = req.headers.get("host") ?? "";
  const isCustomDomain = host === "byund.com" || host.endsWith(".byund.com");
  const isProd = process.env.NODE_ENV === "production";

  const response = NextResponse.redirect(new URL("/", req.url));

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   isProd || isCustomDomain,
    sameSite: "lax",                               // lax works cross-redirect; none only needed cross-site iframes
    domain:   isCustomDomain ? ".byund.com" : undefined,
    path:     "/",
    maxAge:   7 * 24 * 60 * 60,
  });

  return response;
}
