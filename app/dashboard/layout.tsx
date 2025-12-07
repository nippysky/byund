// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import "../globals.css";
import DashboardShell from "@/components/dashboard/DashboardShell";


export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
