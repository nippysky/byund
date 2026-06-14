"use client";
import { useState } from "react";
import { Search, Bell, Plus, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import GlobalSearch from "@/components/ui/GlobalSearch";
import NotificationPanel from "@/components/ui/NotificationPanel";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick?: () => void };
}

export default function Topbar({ title, subtitle, action }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <GlobalSearch />

      <div className="app-topbar">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Search trigger — opens Cmd+K palette */}
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              width: 200, padding: "7px 12px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 9, fontSize: 13, color: "var(--text-muted)",
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}
          >
            <Search size={13} />
            <span style={{ flex: 1 }}>Search…</span>
            <kbd style={{ fontSize: 10, padding: "1px 5px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "inherit" }}>⌘K</kbd>
          </button>

          <ThemeToggle />

          {/* Notifications bell */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              style={{
                width: 34, height: 34, borderRadius: 9,
                background: notifOpen ? "var(--surface-2)" : "var(--surface)",
                border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-muted)", position: "relative", cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Bell size={15} />
              <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#ef4444", border: "1.5px solid var(--bg)" }} />
            </button>

            {notifOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setNotifOpen(false)} />
                <div style={{ position: "absolute", top: 42, right: 0, zIndex: 50 }}>
                  <NotificationPanel onClose={() => setNotifOpen(false)} />
                </div>
              </>
            )}
          </div>

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
    </>
  );
}
