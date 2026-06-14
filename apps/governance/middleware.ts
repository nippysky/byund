import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "byund_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

/**
 * Governance app middleware — route protection.
 *
 * Every protected route checks for a valid byund_session cookie.
 * If missing or invalid:
 *   - With NEXT_PUBLIC_ACCOUNTS_URL set (production SSO): redirect to central accounts app.
 *   - Without it (local dev / standalone): redirect to the local /login page.
 *
 * After login the accounts app redirects back with ?_token for cross-domain
 * handoff (/auth/callback), which sets the cookie for this domain.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Public routes — always allow ────────────────────────────────────────────
  const isPublic =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/auth/") ||          // /auth/callback
    pathname.startsWith("/api/auth/") ||      // /api/auth/login, /logout, /callback
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(svg|png|jpg|ico|webp)$/) != null;

  if (isPublic) return NextResponse.next();

  // ── Verify session ──────────────────────────────────────────────────────────
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next(); // valid session — proceed
    } catch {
      // expired or tampered — fall through to redirect
    }
  }

  // ── Not authenticated — redirect to login ───────────────────────────────────
  const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL;

  if (accountsUrl) {
    // Central SSO: send to accounts.byund.com/login with ?next pointing back to
    // this app's /auth/callback so it can receive the token cross-domain.
    const callbackUrl = `${req.nextUrl.origin}/auth/callback`;
    const loginUrl = new URL(`${accountsUrl}/login`);
    loginUrl.searchParams.set("next", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Standalone fallback: redirect to governance's own login page
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - /login, /register (auth pages)
     * - /auth/* (callback route)
     * - /api/auth/* (auth API routes — each does its own auth check)
     * - /_next/* (static assets, image optimization)
     * - /favicon.ico, images
     */
    "/((?!login|register|auth|api/auth|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
