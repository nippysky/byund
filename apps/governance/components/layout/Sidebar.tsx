"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Server, ClipboardCheck, AlertTriangle,
  FileText, BookOpen, Users, Settings, LogOut, ChevronDown, FileBarChart2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Logo from "@/components/ui/Logo";

const NAV = [
  { href: "/",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/assets",    label: "Assets",    icon: Server },
  { href: "/reviews",   label: "Reviews",   icon: ClipboardCheck },
  { href: "/findings",  label: "Findings",  icon: AlertTriangle },
  { href: "/evidence",  label: "Evidence",  icon: FileText },
  { href: "/audit-log", label: "Audit Log", icon: BookOpen },
  { href: "/report",    label: "Reports",   icon: FileBarChart2 },
];

const BOTTOM = [
  { href: "/team",     label: "Team",     icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, workspace, role, signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="app-sidebar">

      {/* Logo + workspace switcher */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid var(--sidebar-border)" }}>
        <Logo size={32} withProduct showText />

        {workspace && (
          <div style={{
            marginTop: 14, padding: "8px 10px",
            background: "var(--surface-2)", borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: "1px solid var(--border)",
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>
                {workspace.name}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, textTransform: "capitalize" }}>
                {role?.toLowerCase()} · IT Governance
              </div>
            </div>
            <ChevronDown size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", padding: "4px 10px 8px", textTransform: "uppercase" }}>
          Platform
        </div>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`nav-item${isActive(href) ? " active" : ""}`}>
            <Icon size={15} /> {label}
          </Link>
        ))}

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", padding: "16px 10px 8px", textTransform: "uppercase" }}>
          Workspace
        </div>
        {BOTTOM.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`nav-item${isActive(href) ? " active" : ""}`}>
            <Icon size={15} /> {label}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--sidebar-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, var(--brand-hi), var(--brand-lo))",
            color: "#fff", fontWeight: 700, fontSize: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "?"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name ?? "Loading…"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, display: "flex", borderRadius: 6, flexShrink: 0 }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
