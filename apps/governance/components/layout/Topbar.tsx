"use client";
import { Search, Bell, Plus } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick?: () => void };
}

export default function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <div className="app-topbar">
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            placeholder="Search…"
            style={{
              width: 200, padding: "7px 12px 7px 30px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 9, fontSize: 13, color: "var(--text)",
              outline: "none", fontFamily: "inherit",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--brand)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button style={{
          width: 34, height: 34, borderRadius: 9,
          background: "var(--surface)", border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-muted)", position: "relative", cursor: "pointer",
          flexShrink: 0,
        }}>
          <Bell size={15} />
          <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "1.5px solid var(--bg)" }} />
        </button>

        {/* Primary action */}
        {action && (
          <button
            className="btn-primary"
            onClick={action.onClick}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", fontSize: 13, flexShrink: 0 }}
          >
            <Plus size={14} /> {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
