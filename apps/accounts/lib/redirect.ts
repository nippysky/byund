/**
 * Validate a redirect URL to prevent open redirect attacks.
 * Only allows redirects to byund.com subdomains, localhost, and Vercel preview URLs.
 */
const ALLOWED_HOSTS = [
  "byund.com",
  "localhost",
  "127.0.0.1",
  "vercel.app",
];

export function safeRedirectUrl(next: string | null | undefined): string | null {
  if (!next) return null;
  try {
    const url = new URL(next);
    const host = url.hostname;
    const allowed = ALLOWED_HOSTS.some(
      (h) => host === h || host.endsWith("." + h)
    );
    if (!allowed) return null;
    return next;
  } catch {
    return null;
  }
}

/**
 * Build the redirect URL after successful auth.
 *
 * With custom domains (*.byund.com): cookie is shared — redirect directly to ?next.
 * Without custom domains (vercel.app): append ?_token so the receiving app
 *   can set its own cookie via /auth/callback.
 */
export function buildPostAuthRedirect(
  next: string | null,
  token: string,
  requestHost: string,
): string {
  const safeNext = safeRedirectUrl(next);
  if (!safeNext) {
    // No ?next= → land on BYUND Accounts product switcher.
    // User picks which app to open from there.
    return "/";
  }

  // On *.byund.com the cookie is Domain=.byund.com — shared automatically.
  // Skip the token-in-URL handoff.
  const isCustomDomain = requestHost.endsWith(".byund.com") || requestHost === "byund.com";
  if (isCustomDomain) {
    return safeNext;
  }

  // Cross-domain (Vercel preview, localhost) — pass token via URL so the
  // receiving app can set its own cookie in /auth/callback.
  const url = new URL(safeNext);
  url.searchParams.set("_token", token);
  return url.toString();
}
