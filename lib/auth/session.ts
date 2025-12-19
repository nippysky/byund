import { randomBytes, createHash } from "crypto";

export const SESSION_DAYS = 14;

export const COOKIE_NAME =
  process.env.NODE_ENV === "production" ? "__Host-byund_session" : "byund_session";

export function newSessionToken() {
  return randomBytes(32).toString("hex"); // 256-bit token
}

export function hashToken(token: string) {
  // store only hash in DB
  return createHash("sha256").update(token).digest("hex");
}

export function sessionExpiry() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

export function cookieOptions(expires: Date) {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production", // avoid dev headaches
    sameSite: "lax" as const,
    path: "/",
    expires,
  };
}
