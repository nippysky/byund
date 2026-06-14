import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);
const COOKIE = "byund_session";

/**
 * Governance proxy — route protection + SSO redirect.
 *
 * Unauthenticated users are sent to:
 *   - accounts.byund.com/login?next=<callback>  when NEXT_PUBLIC_ACCOUNTS_URL is set (production SSO)
 *   - /login?from=<path>                         when running standalone (local dev / no accounts app)
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Always-public paths ────────────────────────────────────────────────────
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/auth/") ||       // /auth/callback SSO handoff
    pathname.startsWith("/api/auth/") ||   // /api/auth/* — routes handle own auth
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|ico|webp|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Verify session ─────────────────────────────────────────────────────────
  const token = req.cookies.get(COOKIE)?.value;

  if (token) {
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      // expired / tampered — fall through to redirect
    }
  }

  // ── Not authenticated — redirect to login ──────────────────────────────────
  const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL;

  if (accountsUrl) {
    // Central SSO: send user to accounts app with ?next pointing at our callback
    const callbackUrl = `${req.nextUrl.origin}/auth/callback`;
    const loginUrl = new URL(`${accountsUrl}/login`);
    loginUrl.searchParams.set("next", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Standalone fallback: local login page
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
