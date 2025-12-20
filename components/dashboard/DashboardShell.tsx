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
import { useToast } from "@/components/ui/Toast";

type DashboardContextValue = {
  profile: { name: string; email: string } | null;
  isHydrated: boolean;
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

  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
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
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

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

      setProfile(null);
      window.location.assign("/signin");
    } catch {
      setIsLoggingOut(false);
      toast({ title: "Logout failed", variant: "error", message: "Try again." });
    }
  }, [toast, isLoggingOut]);

  const value = useMemo<DashboardContextValue>(
    () => ({ profile, isHydrated, isLoggingOut, logout, refresh }),
    [profile, isHydrated, isLoggingOut, logout, refresh]
  );

  return (
    <DashboardContext.Provider value={value}>
      <div className="min-h-screen bg-surface text-foreground">
        <div className="flex min-h-screen">
          <Sidebar />
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
  return <ShellInner>{children}</ShellInner>;
}
