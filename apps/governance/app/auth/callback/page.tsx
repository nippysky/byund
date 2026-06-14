/**
 * /auth/callback — Cross-domain SSO token handoff.
 *
 * The central accounts app redirects here after login with ?_token=<jwt>.
 * This server component:
 *   1. Reads the token from the query string
 *   2. Verifies it with the shared JWT_SECRET
 *   3. Sets the byund_session cookie for this domain
 *   4. Redirects to the dashboard
 *
 * When custom *.byund.com domains are active, the cookie from accounts.byund.com
 * is already shared (Domain=.byund.com) — but this callback remains harmless.
 */
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const COOKIE_NAME = "byund_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

interface Props {
  searchParams: Promise<{ _token?: string }>;
}

export default async function AuthCallbackPage({ searchParams }: Props) {
  const { _token } = await searchParams;

  if (!_token) {
    redirect("/login");
  }

  try {
    // Verify the token is genuine (signed by our JWT_SECRET)
    await jwtVerify(_token, SECRET);

    // Set the cookie for this domain
    const isProd = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, _token, {
      httpOnly:  true,
      secure:    isProd,
      sameSite:  isProd ? "none" : "lax",
      domain:    isProd ? ".byund.com" : undefined,
      path:      "/",
      maxAge:    7 * 24 * 60 * 60, // 7 days
    });

    redirect("/");
  } catch {
    // Invalid or expired token — back to login
    redirect("/login");
  }
}
