import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "byund_session";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

export interface SessionPayload {
  userId:      string;
  workspaceId: string;
  role:        string;
  name:        string;
  email:       string;
}

interface RawJwt {
  sub?:        string;
  userId?:     string;
  workspaceId: string;
  role:        string;
  name:        string;
  email:       string;
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const p = payload as unknown as RawJwt;
    const userId = p.userId ?? p.sub;
    if (!userId || !p.workspaceId) return null;
    return {
      userId,
      workspaceId: p.workspaceId,
      role:        p.role ?? "VIEWER",
      name:        p.name ?? "",
      email:       p.email ?? "",
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * CRITICAL: Only set Domain=.byund.com when actually on a .byund.com host.
 * Browsers silently reject cookies where the domain attribute doesn't match
 * the response origin. On vercel.app / localhost, omit domain entirely.
 */
function cookieHeader(token: string, maxAge: number, host?: string): string {
  const isCustomDomain = !!host && (host === "byund.com" || host.endsWith(".byund.com"));
  const isProd   = process.env.NODE_ENV === "production";
  const secure   = isProd || isCustomDomain ? "; Secure" : "";
  const domain   = isCustomDomain ? "; Domain=.byund.com" : "";
  const sameSite = "; SameSite=Lax";
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}${secure}${sameSite}${domain}`;
}

export function setSessionCookie(token: string, response: Response, host?: string) {
  response.headers.append("Set-Cookie", cookieHeader(token, 7 * 24 * 60 * 60, host));
}

export function clearSessionCookie(response: Response, host?: string) {
  response.headers.append("Set-Cookie", cookieHeader("", 0, host));
}
