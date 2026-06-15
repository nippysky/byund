export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";
import { buildPostAuthRedirect } from "@/lib/redirect";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { email, password, next } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("[accounts/login] Neither API_URL nor NEXT_PUBLIC_API_URL is configured");
      return NextResponse.json({ error: "Auth service unavailable — API_URL not set" }, { status: 503 });
    }

    let apiRes: Response;
    try {
      apiRes = await fetch(`${apiUrl}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch (fetchErr) {
      console.error("[accounts/login] fetch failed:", fetchErr);
      return NextResponse.json({ error: "Cannot reach auth service. Is Railway running?" }, { status: 503 });
    }

    // Safely parse JSON — Railway/NestJS may return HTML on cold-start errors
    let data: Record<string, unknown>;
    try {
      data = await apiRes.json();
    } catch {
      const text = await apiRes.text().catch(() => "(unreadable)");
      console.error("[accounts/login] non-JSON response:", apiRes.status, text.slice(0, 200));
      return NextResponse.json(
        { error: `Auth service error (${apiRes.status})` },
        { status: 502 },
      );
    }

    if (!apiRes.ok) {
      const msg = Array.isArray(data.message)
        ? (data.message as string[]).join(", ")
        : (data.message as string) ?? (data.error as string) ?? "Login failed";
      return NextResponse.json({ error: msg }, { status: apiRes.status });
    }

    const host        = req.headers.get("host") ?? "";
    const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL ?? "https://byund.vercel.app";
    // When no ?next= is given, send the user to the marketing products page.
    // We bypass buildPostAuthRedirect here so the JWT token isn't appended to
    // a public marketing URL — the products page doesn't need it.
    const redirectTo = (next as string | null)
      ? buildPostAuthRedirect(next as string, data.token as string, host)
      : `${marketingUrl}/products`;

    const res = NextResponse.json({
      redirectTo,
      user:      data.user,
      workspace: data.workspace,
    });

    setSessionCookie(data.token as string, res, host);
    return res;
  } catch (e) {
    console.error("[accounts/login] unexpected:", e);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
