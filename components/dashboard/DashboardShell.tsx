// components/dashboard/DashboardShell.tsx
"use client";

import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar (desktop) */}
        <Sidebar />

        {/* Main area */}
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar />

          <main className="flex-1 px-4 pb-10 pt-4 md:px-6 md:pt-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
