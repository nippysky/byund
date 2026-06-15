export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  // 303 See Other converts POST → GET on redirect, preventing 405 on /login
  const res = NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  clearSessionCookie(res, host);
  return res;
}

export async function GET(req: NextRequest) {
  return POST(req);
}
