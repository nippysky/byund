// lib/auth/current-user.ts
import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { COOKIE_NAME, hashToken } from "@/lib/auth/session";

export type CurrentUser = {
  id: string;
  email: string;
  merchant: {
    id: string;
    publicName: string;
    settlementWallet: string | null;
    dashboardMode: "TEST" | "LIVE";
    brandLeftBg: string;
    brandLeftFg: string;
    brandAccent: string;
  } | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          merchant: {
            select: {
              id: true,
              publicName: true,
              settlementWallet: true,
              dashboardMode: true,
              brandLeftBg: true,
              brandLeftFg: true,
              brandAccent: true,
            },
          },
        },
      },
    },
  });

  if (!session) return null;

  // Expired session → treat as logged out
  if (session.expiresAt.getTime() <= Date.now()) return null;

  return session.user as CurrentUser;
}
