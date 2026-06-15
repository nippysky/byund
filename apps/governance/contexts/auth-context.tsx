"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CurrentUser {
  id:        string;
  name:      string;
  email:     string;
  avatarUrl?: string;
}

export interface CurrentWorkspace {
  id:       string;
  name:     string;
  slug:     string;
  industry?: string;
  timezone: string;
}

interface AuthContextValue {
  user:      CurrentUser | null;
  workspace: CurrentWorkspace | null;
  role:      string | null;
  loading:   boolean;
  signOut:   () => void;
  refresh:   () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<CurrentUser | null>(null);
  const [workspace, setWorkspace] = useState<CurrentWorkspace | null>(null);
  const [role,      setRole]      = useState<string | null>(null);
  const [loading,   setLoading]   = useState(true);

  const fetchMe = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) { setUser(null); setWorkspace(null); return; }
      const data = await res.json();
      setUser(data.user);
      setWorkspace(data.workspace);
      setRole(data.role);
    } catch {
      setUser(null); setWorkspace(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  const signOut = () => {
    // Full page navigation — lets the browser follow the redirect chain:
    // governance /api/auth/logout → clears governance cookie → redirects to
    // accounts /api/auth/logout → clears accounts cookie → redirects to
    // accounts /login (user is fully signed out of all BYUND products)
    //
    // Using fetch() won't work here: cross-origin Set-Cookie headers are
    // blocked in fetch responses, so the accounts cookie never gets cleared.
    window.location.href = "/api/auth/logout";
  };

  return (
    <AuthContext.Provider value={{ user, workspace, role, loading, signOut, refresh: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
