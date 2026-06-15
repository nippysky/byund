/**
 * GET /api/auth/me — returns the current user from session cookie.
 * Called by the marketing Header on mount to decide whether to show
 * "Sign in" or the avatar dropdown.
 */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null);
  return NextResponse.json({
    name:  session.name,
    email: session.email,
  });
}
