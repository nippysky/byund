export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const res = NextResponse.redirect(new URL("/login", req.url));
  clearSessionCookie(res, host);
  return res;
}

export async function GET(req: NextRequest) {
  return POST(req);
}
