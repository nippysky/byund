// proxy.ts
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-byund_session"
    : "byund_session";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect dashboard routes here (fast gate).
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/signin";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
