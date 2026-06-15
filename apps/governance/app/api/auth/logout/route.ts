export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

/**
 * POST /api/auth/logout
 *
 * 1. Clears the byund_session cookie on the governance domain
 * 2. Redirects to accounts /api/auth/logout so the accounts-domain
 *    cookie is also cleared (true SSO logout — like Google)
 * 3. Accounts logout then sends the user to accounts /login
 */
export async function POST(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL;
  const logoutDest  = accountsUrl
    ? `${accountsUrl}/api/auth/logout`   // clear accounts cookie too → then accounts /login
    : new URL("/login", req.url).toString();

  // 303 See Other converts POST → GET on every hop — avoids 405 on destination pages
  const res = NextResponse.redirect(logoutDest, { status: 303 });
  clearSessionCookie(res, host);
  return res;
}

// Support GET so a plain <a href="/api/auth/logout"> also works
export async function GET(req: NextRequest) {
  return POST(req);
}
