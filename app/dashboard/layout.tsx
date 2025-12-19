// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Hard gate: validates DB session token hash + expiry.
  // If not authed, redirects to /signin.
  await requireAuth();

  return <DashboardShell>{children}</DashboardShell>;
}
