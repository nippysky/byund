import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "byund_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

/**
 * Accounts app proxy.
 *
 * - Auth pages (/login, /register) are always accessible.
 * - Root (/) requires a valid session.
 * - If already logged in AND ?next is present on /login or /register,
 *   skip the form and immediately forward the user (transparent SSO pass-through).
 */
export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Always allow API routes and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE)?.value;

  // Root — must be authenticated
  if (pathname === "/") {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // /login or /register — if already authenticated AND ?next is present,
  // skip the form and redirect straight through (SSO pass-through).
  if ((pathname === "/login" || pathname === "/register") && token) {
    try {
      await jwtVerify(token, SECRET);
      const next = searchParams.get("next");
      if (next) return NextResponse.redirect(new URL(next));
      return NextResponse.redirect(new URL("/", req.url));
    } catch {
      // expired — fall through and show the form
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
