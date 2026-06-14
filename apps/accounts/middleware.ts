import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "byund_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

/**
 * Accounts app middleware.
 *
 * - If the user is already authenticated AND a ?next redirect is present,
 *   forward them immediately (they're just passing through for SSO).
 * - Auth pages (/login, /register) are always accessible.
 */
export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Always allow API routes and static files
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Root page (/) — if logged in, pass through; else redirect to /login
  if (pathname === "/") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // On /login or /register — if already logged in AND ?next is provided,
  // skip showing the form and immediately redirect through SSO.
  if ((pathname === "/login" || pathname === "/register") && token) {
    try {
      await jwtVerify(token, SECRET);
      const next = searchParams.get("next");
      if (next) {
        // User is already authenticated — redirect to the app directly.
        // The app will handle the cookie (shared via .byund.com or via callback).
        return NextResponse.redirect(new URL(next));
      }
      // No ?next — show the accounts portal (root page)
      return NextResponse.redirect(new URL("/", req.url));
    } catch {
      // Token expired/invalid — fall through to show login form
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
