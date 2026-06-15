import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

export const COOKIE_NAME = "byund_session";

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

export async function createSession(payload: SessionPayload) {
  const raw: RawJwt = {
    sub:         payload.userId,
    userId:      payload.userId,
    workspaceId: payload.workspaceId,
    role:        payload.role,
    name:        payload.name,
    email:       payload.email,
  };
  return new SignJWT(raw as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
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
  return verifySession(token);
}

/**
 * Build cookie options that respect the actual host.
 * CRITICAL: Setting Domain=.byund.com on a vercel.app origin causes
 * browsers to silently reject the cookie. Only set domain on real byund.com hosts.
 */
function cookieHeader(token: string, maxAge: number, host?: string): string {
  const isCustomDomain = !!host && (host === "byund.com" || host.endsWith(".byund.com"));
  const isProd = process.env.NODE_ENV === "production";
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
