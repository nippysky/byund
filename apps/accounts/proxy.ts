import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "byund_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

/**
 * Accounts SSO proxy (Next.js 16 — proxy.ts, not middleware.ts).
 *
 * Rules:
 *  /api/*          → always pass through (route handlers own their auth)
 *  /login, /register → always render (public pages)
 *  /               → require valid session; else → /login
 *
 * Already-authenticated SSO pass-through:
 *  If the user hits /login?next=<callback> while already logged in,
 *  we skip the login form and redirect directly to <callback>?_token=<jwt>
 *  so the receiving app can set its own domain cookie via /auth/callback.
 *  This handles re-entry after governance logout without showing the login form.
 */
export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Always pass API routes and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;

  // Root (/) — requires authentication
  if (pathname === "/") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      // Expired — clear stale cookie and show login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete(COOKIE);
      return res;
    }
  }

  // /login or /register — if already authenticated, do SSO pass-through
  if ((pathname === "/login" || pathname === "/register") && token) {
    try {
      await jwtVerify(token, SECRET);
      const next = searchParams.get("next");

      if (next) {
        // CRITICAL: append ?_token=<jwt> so the receiving app's /auth/callback
        // can set its own cookie. Without this the callback has no token and loops.
        try {
          const callbackUrl = new URL(next);
          callbackUrl.searchParams.set("_token", token);
          return NextResponse.redirect(callbackUrl.toString());
        } catch {
          // Invalid `next` URL — fall through to show login form
        }
      }

      // No next param — send to home (product switcher)
      return NextResponse.redirect(new URL("/", req.url));
    } catch {
      // Token expired — fall through and show the login form
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
