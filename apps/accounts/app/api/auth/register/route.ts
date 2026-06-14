import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { buildPostAuthRedirect } from "@/lib/redirect";

/**
 * POST /api/auth/register
 *
 * Central SSO registration. Creates account via NestJS auth service,
 * sets byund_session cookie, returns redirect URL for cross-domain handoff.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, workspaceName, next } = await req.json();

    if (!name || !email || !password || !workspaceName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[accounts/register] API_URL is not configured");
      return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });
    }

    const apiRes = await fetch(`${apiUrl}/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, workspaceName }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: data.message ?? data.error ?? "Registration failed" },
        { status: apiRes.status },
      );
    }

    const host = req.headers.get("host") ?? "";
    const redirectTo = buildPostAuthRedirect(next, data.token, host);

    const res = NextResponse.json(
      { redirectTo, user: data.user, workspace: data.workspace },
      { status: 201 },
    );

    setSessionCookie(data.token, res);
    return res;
  } catch (e: any) {
    console.error("[accounts/register]", e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
