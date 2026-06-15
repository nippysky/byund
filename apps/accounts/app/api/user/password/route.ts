export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  // Verify caller is authenticated
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.currentPassword || !body?.newPassword) {
    return NextResponse.json({ error: "currentPassword and newPassword required" }, { status: 400 });
  }
  if (body.newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });

  // Get current JWT token to pass as Bearer
  const cookieStore = await cookies();
  const token = cookieStore.get("byund_session")?.value;

  let apiRes: Response;
  try {
    apiRes = await fetch(`${apiUrl}/v1/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword:     body.newPassword,
      }),
    });
  } catch (err) {
    console.error("[user/password] fetch failed:", err);
    return NextResponse.json({ error: "Cannot reach auth service" }, { status: 503 });
  }

  if (!apiRes.ok) {
    const data = await apiRes.json().catch(() => ({}));
    const msg = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message ?? data.error ?? "Failed to update password";
    return NextResponse.json({ error: msg }, { status: apiRes.status });
  }

  return NextResponse.json({ ok: true });
}
