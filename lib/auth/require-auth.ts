// lib/auth/require-auth.ts
import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  return user;
}
