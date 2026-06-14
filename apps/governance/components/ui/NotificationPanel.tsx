"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, ClipboardCheck, Clock, CheckCircle2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "overdue_review" | "critical_finding" | "upcoming_review" | "finding_resolved";
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
}

const ICONS: Record<Notification["type"], React.ElementType> = {
  overdue_review:    Clock,
  critical_finding:  AlertTriangle,
  upcoming_review:   ClipboardCheck,
  finding_resolved:  CheckCircle2,
};

const ICON_COLORS: Record<Notification["type"], string> = {
  overdue_review:   "#ef4444",
  critical_finding: "#f97316",
  upcoming_review:  "#3b82f6",
  finding_resolved: "#10b981",
};

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => setItems(d.notifications ?? []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
  };

  const markAllRead = async () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })));
    await fetch("/api/notifications/read-all", { method: "POST" });
  };

  const unread = items.filter(n => !n.read).length;

  return (
    <div style={{
      width: 360, background: "var(--surface-1)", border: "1px solid var(--border-med)",
      borderRadius: 14, overflow: "hidden",
      boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>Notifications</span>
          {unread > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "var(--brand)", color: "#fff", borderRadius: 100, padding: "1px 7px" }}>{unread}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ fontSize: 12, color: "var(--brand-hi)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Mark all read
            </button>
          )}
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}><X size={15} /></button>
        </div>
      </div>

      {/* Items */}
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, background: "var(--surface-2)", borderRadius: 4, marginBottom: 6, width: "70%" }} />
                <div style={{ height: 10, background: "var(--surface-2)", borderRadius: 4, width: "90%" }} />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            <CheckCircle2 size={28} style={{ color: "#10b981", margin: "0 auto 10px", display: "block" }} />
            All caught up — no notifications
          </div>
        ) : (
          items.map(n => {
            const Icon = ICONS[n.type];
            const color = ICON_COLORS[n.type];
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  display: "flex", gap: 12, padding: "13px 16px",
                  borderBottom: "1px solid var(--border)",
                  background: n.read ? "transparent" : "rgba(114,96,251,0.04)",
                  cursor: "pointer", transition: "background 0.12s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? "transparent" : "rgba(114,96,251,0.04)")}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", lineHeight: 1.3, margin: 0 }}>{n.title}</p>
                    {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand)", flexShrink: 0, marginTop: 3 }} />}
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "3px 0 0", lineHeight: 1.4 }}>{n.body}</p>
                  <p style={{ fontSize: 11, color: "var(--text-3)", margin: "4px 0 0" }}>
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
