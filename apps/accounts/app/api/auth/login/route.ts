import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { buildPostAuthRedirect } from "@/lib/redirect";

/**
 * POST /api/auth/login
 *
 * Central SSO login — delegates to the NestJS auth API.
 * Sets the byund_session cookie on the accounts domain AND returns a
 * redirect URL (with ?_token for cross-domain handoff) so the originating
 * BYUND product can set its own cookie too.
 *
 * When custom domains are live (*.byund.com), the cookie Domain=.byund.com
 * is shared automatically — no callback needed.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password, next } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[accounts/login] API_URL is not configured");
      return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });
    }

    // Delegate to the central NestJS auth service
    const apiRes = await fetch(`${apiUrl}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(
        { error: data.message ?? data.error ?? "Login failed" },
        { status: apiRes.status },
      );
    }

    // Build the post-auth redirect URL
    const host = req.headers.get("host") ?? "";
    const redirectTo = buildPostAuthRedirect(next, data.token, host);

    const res = NextResponse.json({
      redirectTo,
      user:      data.user,
      workspace: data.workspace,
    });

    // Set cookie on accounts domain (shared on .byund.com when custom domains are live)
    setSessionCookie(data.token, res);
    return res;
  } catch (e) {
    console.error("[accounts/login]", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
