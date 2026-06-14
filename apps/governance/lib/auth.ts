import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "byund-governance-secret-change-in-production"
);

/**
 * Cookie name — shared across ALL BYUND products for SSO.
 * The NestJS API (accounts.byund.com) sets this same cookie scoped to .byund.com.
 */
export const COOKIE_NAME = "byund_session";

export interface SessionPayload {
  userId:      string;
  workspaceId: string;
  role:        string;
  name:        string;
  email:       string;
}

// Raw JWT shape — NestJS uses "sub", governance uses "userId"; support both
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
    sub:         payload.userId,   // canonical SSO field
    userId:      payload.userId,   // backward-compat field
    workspaceId: payload.workspaceId,
    role:        payload.role,
    name:        payload.name,
    email:       payload.email,
  };

  const token = await new SignJWT(raw as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const p = payload as unknown as RawJwt;

    // Accept both "userId" (legacy governance) and "sub" (NestJS SSO)
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

export function setSessionCookie(token: string, response: Response) {
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? "; Domain=.byund.com" : "";
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=${isProd ? "None" : "Lax"}${isProd ? "; Secure" : ""}${domain}`
  );
}

export function clearSessionCookie(response: Response) {
  const isProd = process.env.NODE_ENV === "production";
  const domain = isProd ? "; Domain=.byund.com" : "";
  response.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=${isProd ? "None" : "Lax"}${isProd ? "; Secure" : ""}${domain}`
  );
}
