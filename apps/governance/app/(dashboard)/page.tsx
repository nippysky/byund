"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { format, subDays } from "date-fns";
import Topbar from "@/components/layout/Topbar";
import {
  Server, AlertTriangle, ClipboardCheck, ShieldCheck,
  TrendingUp, TrendingDown, Minus, ArrowRight, Plus,
  Activity, Target, Zap,
} from "lucide-react";

/* ── types ─────────────────────────────────────────── */
interface Stats {
  totalAssets: number;
  dueForReview: number;
  openFindings: number;
  criticalFindings: number;
  auditCoverage: number;
  overdueReviews: number;
  riskScore: number;
  assetsByCriticality: { name: string; value: number; color: string }[];
  findingsBySeverity:  { name: string; value: number; color: string }[];
  reviewTrend:         { date: string; completed: number; created: number }[];
  upcomingReviews: Array<{ id: string; dueAt: string; status: string; asset: { name: string; type: string; criticality: string } }>;
  recentActivity:  Array<{ id: string; action: string; targetLabel?: string; createdAt: string; actor?: { name: string } }>;
}

const ACTION_COLORS: Record<string, string> = {
  ASSET_CREATED: "#22c55e",   ASSET_UPDATED: "#7260fb",   ASSET_ARCHIVED: "#94a3b8",
  REVIEW_COMPLETED: "#22c55e", FINDING_CREATED: "#ef4444", FINDING_RESOLVED: "#22c55e",
  FINDING_UPDATED: "#f59e0b", MEMBER_INVITED: "#06b6d4",  EVIDENCE_UPLOADED: "#8b5cf6",
  WORKSPACE_UPDATED: "#7260fb", MEMBER_REMOVED: "#ef4444",
};

const CRIT_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#f59e0b", LOW: "#6b7280",
};

const STATUS_COLORS: Record<string, string> = {
  OVERDUE: "danger", DUE: "warning", UPCOMING: "info", IN_PROGRESS: "brand", COMPLETED: "success",
};

/* ── helpers ─────────────────────────────────────────── */
function Skel({ h = 20, r = 8 }: { h?: number; r?: number }) {
  return (
    <div style={{ height: h, borderRadius: r, background: "var(--surface-2)", animation: "pulse 1.5s ease-in-out infinite" }} />
  );
}

function Trend({ v }: { v: number }) {
  if (v === 0) return <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 3 }}><Minus size={12} /> No change</span>;
  const up = v > 0;
  return (
    <span style={{ fontSize: 12, color: up ? "#ef4444" : "#22c55e", display: "flex", alignItems: "center", gap: 3 }}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(v)} this week
    </span>
  );
}

/* ── custom recharts tooltip ─────────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
      {label && <p style={{ color: "var(--text-muted)", marginBottom: 6, fontWeight: 600 }}>{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, margin: "2px 0", fontWeight: 600 }}>
          {p.name}: <span style={{ color: "var(--text-1)" }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ── main ─────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => { toast.error("Failed to load dashboard"); setLoading(false); });
  }, []);

  const KPI_CARDS = stats ? [
    {
      label: "Total Assets",    value: stats.totalAssets,
      icon: Server,             color: "var(--brand)",
      trend: 0,                 href: "/assets",
      sub: `${stats.assetsByCriticality.find(c => c.name === "CRITICAL")?.value ?? 0} critical`,
    },
    {
      label: "Due for Review",  value: stats.dueForReview,
      icon: ClipboardCheck,     color: "#f59e0b",
      trend: stats.overdueReviews, href: "/reviews",
      sub: `${stats.overdueReviews} overdue`,
    },
    {
      label: "Open Findings",   value: stats.openFindings,
      icon: AlertTriangle,      color: "#ef4444",
      trend: stats.criticalFindings, href: "/findings",
      sub: `${stats.criticalFindings} critical`,
    },
    {
      label: "Audit Coverage",  value: `${stats.auditCoverage}%`,
      icon: ShieldCheck,        color: "#22c55e",
      trend: 0,                 href: "/report",
      sub: "of assets reviewed",
    },
  ] : [];

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .dash-card { animation: fadeUp 0.35s ease both; }
      `}</style>

      <Topbar
        title="Dashboard"
        subtitle="Governance overview — live from your database"
        action={{ label: "Add Asset", onClick: () => router.push("/assets") }}
      />

      <div className="app-content">

        {/* ── KPI Cards ───────────────────────────── */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {loading
            ? Array(4).fill(0).map((_, i) => <div key={i} className="stat-card"><Skel h={80} /></div>)
            : KPI_CARDS.map(({ label, value, icon: Icon, color, trend, href, sub }, i) => (
              <div
                key={label}
                className="stat-card dash-card"
                style={{ cursor: "pointer", transition: "border-color 0.15s, transform 0.15s", animationDelay: `${i * 60}ms` }}
                onClick={() => router.push(href)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--text-1)", lineHeight: 1 }}>{value}</div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</span>
                  <Trend v={trend} />
                </div>
              </div>
            ))}
        </div>

        {/* ── Risk Score banner ───────────────────── */}
        {!loading && stats && (
          <div className="dash-card" style={{
            animationDelay: "240ms",
            marginBottom: 24, padding: "16px 22px",
            background: stats.riskScore > 70
              ? "rgba(239,68,68,0.06)"
              : stats.riskScore > 40
                ? "rgba(245,158,11,0.06)"
                : "rgba(34,197,94,0.06)",
            border: `1px solid ${stats.riskScore > 70 ? "rgba(239,68,68,0.2)" : stats.riskScore > 40 ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)"}`,
            borderRadius: 14,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: stats.riskScore > 70 ? "rgba(239,68,68,0.12)" : stats.riskScore > 40 ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Target size={20} style={{ color: stats.riskScore > 70 ? "#ef4444" : stats.riskScore > 40 ? "#f59e0b" : "#22c55e" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>
                Risk Score: <span style={{ color: stats.riskScore > 70 ? "#ef4444" : stats.riskScore > 40 ? "#f59e0b" : "#22c55e" }}>{stats.riskScore}/100</span>
                {" "}— {stats.riskScore > 70 ? "High Risk" : stats.riskScore > 40 ? "Moderate Risk" : "Low Risk"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Based on {stats.criticalFindings} critical findings, {stats.overdueReviews} overdue reviews, and audit coverage of {stats.auditCoverage}%
              </div>
            </div>
            <div style={{ width: 160, height: 6, borderRadius: 100, background: "var(--surface-3)", flexShrink: 0 }}>
              <div style={{ height: "100%", borderRadius: 100, width: `${stats.riskScore}%`, background: stats.riskScore > 70 ? "#ef4444" : stats.riskScore > 40 ? "#f59e0b" : "#22c55e", transition: "width 1s ease" }} />
            </div>
          </div>
        )}

        {/* ── Charts row ──────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 240px", gap: 20, marginBottom: 24 }}>

          {/* Area: review trend */}
          <div className="card dash-card" style={{ padding: "20px 20px 12px", animationDelay: "300ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>Review Activity</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Last 14 days</div>
              </div>
              <Activity size={15} style={{ color: "var(--text-muted)" }} />
            </div>
            {loading ? <Skel h={160} /> : (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={stats?.reviewTrend ?? []} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7260fb" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#7260fb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" strokeWidth={2} fill="url(#gradCompleted)" dot={false} />
                  <Area type="monotone" dataKey="created"   name="Scheduled" stroke="#7260fb" strokeWidth={2} fill="url(#gradCreated)"   dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar: findings by severity */}
          <div className="card dash-card" style={{ padding: "20px 20px 12px", animationDelay: "360ms" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>Open Findings</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>By severity</div>
              </div>
              <Zap size={15} style={{ color: "var(--text-muted)" }} />
            </div>
            {loading ? <Skel h={160} /> : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stats?.findingsBySeverity ?? []} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" name="Findings" radius={[5, 5, 0, 0]}>
                    {(stats?.findingsBySeverity ?? []).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie: asset criticality */}
          <div className="card dash-card" style={{ padding: "20px", animationDelay: "420ms" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>Asset Risk</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>By criticality</div>
            {loading ? <Skel h={140} /> : (
              <>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={stats?.assetsByCriticality ?? []} cx="50%" cy="50%" innerRadius={36} outerRadius={54} paddingAngle={2} dataKey="value">
                      {(stats?.assetsByCriticality ?? []).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
                  {(stats?.assetsByCriticality ?? []).map(e => (
                    <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                        <span style={{ color: "var(--text-muted)" }}>{e.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: "var(--text-1)" }}>{e.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Upcoming Reviews + Activity ─────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          <div className="card dash-card" style={{ animationDelay: "480ms" }}>
            <div className="card-header">
              <span className="card-title">Upcoming Reviews</span>
              <button
                onClick={() => router.push("/reviews")}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--brand-hi)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="card-body">
              {loading
                ? <div style={{ padding: 20 }}><Skel h={120} /></div>
                : !stats?.upcomingReviews?.length
                  ? <Empty msg="No upcoming reviews" action={{ label: "Add Asset", onClick: () => router.push("/assets") }} />
                  : (
                    <table className="data-table">
                      <thead><tr><th>Asset</th><th>Due</th><th>Status</th></tr></thead>
                      <tbody>
                        {stats.upcomingReviews.map(r => (
                          <tr key={r.id} onClick={() => router.push("/reviews")} style={{ cursor: "pointer" }}>
                            <td>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{r.asset?.name}</div>
                              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.asset?.type?.replace(/_/g, " ")}</div>
                            </td>
                            <td style={{ fontSize: 12 }}>{format(new Date(r.dueAt), "d MMM")}</td>
                            <td>
                              <span className={`badge badge-${STATUS_COLORS[r.status] ?? "neutral"}`}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
            </div>
          </div>

          <div className="card dash-card" style={{ animationDelay: "540ms" }}>
            <div className="card-header">
              <span className="card-title">Recent Activity</span>
              <button
                onClick={() => router.push("/audit-log")}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--brand-hi)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
              >
                Full log <ArrowRight size={12} />
              </button>
            </div>
            <div className="card-body" style={{ padding: "8px 0" }}>
              {loading
                ? <div style={{ padding: 20 }}><Skel h={200} /></div>
                : !stats?.recentActivity?.length
                  ? <Empty msg="No activity yet" />
                  : stats.recentActivity.map(log => (
                    <div key={log.id} className="activity-item">
                      <div className="activity-dot" style={{ background: ACTION_COLORS[log.action] ?? "var(--brand)" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, margin: 0, lineHeight: 1.4 }}>
                          <strong style={{ color: "var(--text-1)" }}>{log.actor?.name ?? "System"}</strong>
                          <span style={{ color: "var(--text-muted)" }}> {log.action.replace(/_/g, " ").toLowerCase()}</span>
                          {log.targetLabel && <span style={{ color: "var(--brand-hi)" }}> {log.targetLabel}</span>}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-3)", margin: "3px 0 0" }}>
                          {format(new Date(log.createdAt), "d MMM · HH:mm")}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Empty({ msg, action }: { msg: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ padding: "36px 20px", textAlign: "center" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>{msg}</p>
      {action && (
        <button onClick={action.onClick} style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "var(--brand-sub)", color: "var(--brand-hi)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
          <Plus size={13} /> {action.label}
        </button>
      )}
    </div>
  );
}
