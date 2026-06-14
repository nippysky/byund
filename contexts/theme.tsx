"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {}, isDark: true });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("byund-theme") as Theme | null;
    const sys = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const resolved = stored ?? sys;
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Add transition class for smooth color swap
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    localStorage.setItem("byund-theme", next);
    setTimeout(() => document.documentElement.classList.remove("theme-transitioning"), 400);
  }, [theme]);

  if (!mounted) return <>{children}</>;

  return (
    <Ctx.Provider value={{ theme, toggle, isDark: theme === "dark" }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
