"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Server, FileSearch } from "lucide-react";

const V = (d: number) => ({
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { delay: d * 0.1, duration: 0.65, ease: [0.23, 1, 0.32, 1] as const } },
});

const ASSETS = [
  { name: "payment-api-prod",  type: "Application",    risk: "HIGH",     col: "#f59e0b", status: "Due in 3d"   },
  { name: "postgres-primary",  type: "Database",        risk: "CRITICAL", col: "#ef4444", status: "Overdue"     },
  { name: "nginx-gateway",     type: "Server",          risk: "MEDIUM",   col: "#7260fb", status: "✓ Reviewed"  },
  { name: "*.acme.com",        type: "SSL Certificate", risk: "HIGH",     col: "#f59e0b", status: "Expiring 30d"},
];

function DashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-med)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 48px 120px rgba(0,0,0,0.5), 0 0 0 1px var(--border), 0 0 100px var(--brand-sub)",
      }}
    >
      {/* Window chrome */}
      <div style={{
        display: "flex", alignItems: "center", gap: "7px",
        padding: "13px 18px", borderBottom: "1px solid var(--border)",
        background: "var(--bg-elevated)",
      }}>
        {["#ff5f57","#ffbe2e","#28c840"].map(c => (
          <span key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
        ))}
        <span style={{ fontSize: "11px", color: "var(--text-3)", marginLeft: "10px", fontWeight: 500 }}>
          BYUND Governance — Asset Register
        </span>
      </div>

      {/* Metric strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid var(--border)" }}>
        {[
          { l: "Total Assets",  v: "142", s: "+4 this month" },
          { l: "Reviews Due",   v: "12",  s: "3 overdue"     },
          { l: "Open Findings", v: "28",  s: "4 critical"    },
        ].map((m, i) => (
          <div key={m.l} style={{ padding: "16px 18px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
            <p style={{ fontSize: "10px", color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{m.l}</p>
            <p style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.05em", margin: "4px 0 2px" }}>{m.v}</p>
            <p style={{ fontSize: "10px", color: "var(--text-3)" }}>{m.s}</p>
          </div>
        ))}
      </div>

      {/* Asset rows */}
      <div style={{ padding: "14px 16px" }}>
        <p className="label" style={{ marginBottom: "10px" }}>Asset Register</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {ASSETS.map((a, i) => (
            <motion.div key={a.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 + i * 0.08, duration: 0.35 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px",
                background: "var(--bg-elevated)",
                borderRadius: "10px",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "7px",
                  background: "var(--brand-sub2)", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Server size={12} color="var(--brand-hi)" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-1)" }}>{a.name}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-3)" }}>{a.type}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  fontSize: "10px", fontWeight: 700, color: a.col,
                  background: `${a.col}18`, border: `1px solid ${a.col}35`,
                  borderRadius: "5px", padding: "2px 8px",
                }}>
                  {a.risk}
                </span>
                <span style={{ fontSize: "10px", color: "var(--text-3)", minWidth: "70px", textAlign: "right" }}>{a.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section style={{ minHeight: "100dvh", display: "flex", alignItems: "center", paddingTop: "80px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div className="grid-bg" />
      <div className="glow-blob" style={{ width: "800px", height: "800px", top: "-250px", left: "50%", transform: "translateX(-50%)", opacity: 0.7 }} />
      <div className="glow-blob" style={{ width: "400px", height: "400px", bottom: "-100px", right: "-100px", opacity: 0.4 }} />

      <div className="container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div className="grid-hero">
          {/* Copy */}
          <div>
            <motion.div variants={V(0)} initial="hidden" animate="show" style={{ marginBottom: "24px" }}>
              <span className="badge-live">
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", display: "inline-block" }} className="animate-pulse-dot" />
                Early Access Open
              </span>
            </motion.div>

            <motion.h1
              variants={V(1)} initial="hidden" animate="show"
              className="display-xl"
              style={{ marginBottom: "28px" }}
            >
              Infrastructure{" "}
              <span className="text-brand">you can</span>
              <br />
              actually trust.
            </motion.h1>

            <motion.p
              variants={V(2)} initial="hidden" animate="show"
              style={{ fontSize: "clamp(16px,1.4vw,19px)", color: "var(--text-2)", lineHeight: 1.7, maxWidth: "460px", marginBottom: "40px" }}
            >
              BYUND gives IT teams a single source of truth for every asset they own —
              who owns it, when it was last reviewed, and what needs attention now.
            </motion.p>

            <motion.div variants={V(3)} initial="hidden" animate="show"
              style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "48px" }}
            >
              <Link href="/#waitlist" className="btn btn-primary btn-lg">
                Get Early Access <ArrowRight size={16} />
              </Link>
              <Link href="/governance" className="btn btn-ghost btn-lg">
                See the product →
              </Link>
            </motion.div>

            <motion.div variants={V(4)} initial="hidden" animate="show"
              style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}
            >
              {[
                { icon: <ShieldCheck size={13} />, text: "Enterprise-grade security" },
                { icon: <Server size={13} />,       text: "9 asset types" },
                { icon: <FileSearch size={13} />,   text: "Full audit trail" },
              ].map(t => (
                <span key={t.text} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "var(--text-3)", fontWeight: 500 }}>
                  <span style={{ color: "var(--brand-hi)" }}>{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Dashboard mock */}
          <div>
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}
