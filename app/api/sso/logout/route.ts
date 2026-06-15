/**
 * POST /api/sso/logout — clears the BYUND SSO session cookie on the marketing site.
 * Does NOT affect the legacy merchant auth cookie.
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/app/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
