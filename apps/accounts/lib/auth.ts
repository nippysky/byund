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
 * Set the shared SSO cookie.
 * In production with *.byund.com custom domains: sets Domain=.byund.com so
 * ALL BYUND products share the session instantly — no callback needed.
 * In staging/Vercel preview: cookie is set per-domain.
 */
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
