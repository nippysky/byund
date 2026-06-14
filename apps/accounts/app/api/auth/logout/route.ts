import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const defaultApp = process.env.NEXT_PUBLIC_DEFAULT_APP_URL ?? "/login";
  const res = NextResponse.redirect(new URL(defaultApp, req.url));
  clearSessionCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  return POST(req);
}
