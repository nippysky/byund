"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sun, Moon, Settings, Shield, LogOut, ChevronDown } from "lucide-react";

interface Props {
  name:     string;
  email:    string;
  initials: string;
}

// ── Theme helpers ─────────────────────────────────────────────────────────────
function getTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem("byund-theme") as "dark" | "light") ??
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
}

function applyTheme(t: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("byund-theme", t);
  // Write to cookie so future page loads on ANY byund.com subdomain inherit it
  document.cookie = `byund-theme=${t}; path=/; max-age=31536000; SameSite=Lax`;
}

// ── Theme Toggle ──────────────────────────────────────────────────────────────
export function ThemeToggle({ size = 15 }: { size?: number }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => { setTheme(getTheme()); }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      width: 34, height: 34, borderRadius: 9,
      background: "var(--surface-2)", border: "1px solid var(--border-med)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--text-2)", cursor: "pointer", flexShrink: 0,
      transition: "background 0.15s",
    }}>
      {theme === "dark" ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
}

// ── Account Dropdown ──────────────────────────────────────────────────────────
export function AccountNav({ name, email, initials }: Props) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setTheme(getTheme()); }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "5px 10px 5px 5px", borderRadius: 99,
          border: "1px solid var(--border-med)",
          background: open ? "var(--surface-2)" : "transparent",
          cursor: "pointer", transition: "background 0.15s",
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #7260fb, #4f3dd4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0, letterSpacing: "-0.01em",
        }}>
          {initials}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </span>
        <ChevronDown size={12} color="var(--text-3)" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)",
          width: 240, background: "var(--surface-1)",
          border: "1px solid var(--border-med)", borderRadius: 14,
          boxShadow: "0 12px 48px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.2)",
          overflow: "hidden", zIndex: 100,
        }}>
          {/* User info */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #7260fb, #4f3dd4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: "#fff",
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ padding: "6px 0" }}>
            {[
              { href: "/settings",          Icon: Settings, label: "Account Settings" },
              { href: "/settings/security", Icon: Shield,   label: "Security & Password" },
            ].map(({ href, Icon, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 16px", color: "var(--text-2)",
                fontSize: 13, fontWeight: 500,
                transition: "background 0.1s, color 0.1s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; (e.currentTarget as HTMLElement).style.color = "var(--text-1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = ""; }}
              >
                <Icon size={14} />
                {label}
              </Link>
            ))}
          </div>

          {/* Theme toggle row */}
          <div style={{ padding: "6px 16px 8px", borderTop: "1px solid var(--border)" }}>
            <button onClick={toggleTheme} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "8px 0",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-2)", fontSize: 13, fontWeight: 500,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </span>
              <div style={{
                width: 34, height: 18, borderRadius: 99,
                background: theme === "dark" ? "var(--brand)" : "var(--border-strong)",
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}>
                <div style={{
                  position: "absolute", top: 2,
                  left: theme === "dark" ? 18 : 2,
                  width: 14, height: 14, borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s",
                }} />
              </div>
            </button>
          </div>

          {/* Sign out */}
          <div style={{ padding: "0 6px 8px", borderTop: "1px solid var(--border)" }}>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 10px", borderRadius: 8, margin: "4px 0",
                background: "none", border: "none", cursor: "pointer",
                color: "var(--danger)", fontSize: 13, fontWeight: 500,
                transition: "background 0.1s",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.07)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "")}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
