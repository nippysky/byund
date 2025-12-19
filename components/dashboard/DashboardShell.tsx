// components/dashboard/DashboardShell.tsx
"use client";

import type { ReactNode } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ToastProvider, useToast } from "@/components/ui/Toast";

type Mode = "TEST" | "LIVE";

type DashboardContextValue = {
  mode: Mode;
  isModeHydrated: boolean;
  setMode: (next: Mode) => Promise<void>;
  profile: { name: string; email: string } | null;
  isLoggingOut: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within <DashboardShell>");
  return ctx;
}

function ShellInner({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const [mode, setModeState] = useState<Mode>("TEST");
  const [isModeHydrated, setIsModeHydrated] = useState(false);

  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/context", {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error("Failed");

      const nextMode: Mode = data.mode === "LIVE" ? "LIVE" : "TEST";
      setModeState(nextMode);

      if (data.profile?.email) {
        setProfile({
          name: String(data.profile.name ?? "Merchant"),
          email: String(data.profile.email),
        });
      } else {
        setProfile(null);
      }
    } catch {
      // soft-fail: server guards still protect pages
    } finally {
      setIsModeHydrated(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setMode = useCallback(
    async (next: Mode) => {
      if (next === mode) return;

      const prev = mode;
      setModeState(next);

      toast({
        title: "Mode updated",
        variant: next === "LIVE" ? "warning" : "default",
        message:
          next === "TEST"
            ? "Test mode: payments won’t move real funds."
            : "Live mode: payments will settle to your wallet.",
      });

      try {
        const res = await fetch("/api/dashboard/mode", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: next }),
          cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");

        setModeState(data.mode === "LIVE" ? "LIVE" : "TEST");
      } catch {
        setModeState(prev);
        toast({
          title: "Couldn’t update mode",
          variant: "error",
          message: "Please try again. If this keeps happening, check your connection.",
        });
      }
    },
    [mode, toast]
  );

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error("Logout failed");

      // Clear client state immediately (snappy UX)
      setProfile(null);
      setModeState("TEST");

      // Hard redirect ensures no cached dashboard UI hangs around
      window.location.assign("/signin");
    } catch {
      setIsLoggingOut(false);
      toast({
        title: "Logout failed",
        variant: "error",
        message: "Try again.",
      });
    }
  }, [toast, isLoggingOut]);

  const value = useMemo<DashboardContextValue>(
    () => ({
      mode,
      isModeHydrated,
      setMode,
      profile,
      isLoggingOut,
      logout,
      refresh,
    }),
    [mode, isModeHydrated, setMode, profile, isLoggingOut, logout, refresh]
  );

  return (
    <DashboardContext.Provider value={value}>
      <div className="min-h-screen bg-surface text-foreground">
        <div className="flex min-h-screen">
          <Sidebar mode={mode === "LIVE" ? "live" : "test"} />

          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />

            <main className="flex-1 px-4 pb-10 pt-4 md:px-6 md:pt-6 lg:px-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ShellInner>{children}</ShellInner>
    </ToastProvider>
  );
}
