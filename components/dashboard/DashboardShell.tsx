// components/dashboard/DashboardShell.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Mode = "test" | "live";

const STORAGE_KEY = "byund-dashboard-mode";

export default function DashboardShell({ children }: { children: ReactNode }) {
  // Stable default for SSR + first client render
  const [mode, setMode] = useState<Mode>("test");

  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null
  );

  // Sync from localStorage AFTER hydration
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "live" || stored === "test") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(stored);
    }
  }, []);

  function showToast(message: string) {
    const id = Date.now();
    setToast({ id, message });

    // Auto-dismiss after 3.5s
    window.setTimeout(() => {
      setToast((current) => (current && current.id === id ? null : current));
    }, 3500);
  }

  function handleModeChange(next: Mode) {
    if (next === mode) return;

    setMode(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }

    showToast(
      next === "test"
        ? "You are now in Test mode. Payments here will not move real funds."
        : "You are now in Live mode. Real funds will settle to your wallet."
    );

    // Later, when the server actually uses mode for queries,
    // we can add `router.refresh()` here to refetch server data.
  }

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar (desktop) */}
        <Sidebar mode={mode} />

        {/* Main area */}
        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar mode={mode} onModeChange={handleModeChange} />

          <main className="flex-1 px-4 pb-10 pt-4 md:px-6 md:pt-6 lg:px-8">
            {children}
          </main>
        </div>

      {/* Toast – bottom-right */}
        {toast && (
          <div className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-end px-4 md:bottom-6 md:px-6 lg:px-8">
            <div className="pointer-events-auto max-w-sm rounded-2xl border border-border bg-white px-4 py-3 shadow-lg shadow-black/5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Mode updated
              </p>
              <p className="mt-1 text-sm text-foreground">{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
