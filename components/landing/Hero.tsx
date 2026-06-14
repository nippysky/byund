"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Server, FileSearch } from "lucide-react";

const FADE = (i: number) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.23, 1, 0.32, 1] as const },
  },
});

function LiveDot() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      fontSize: "11px", fontWeight: 700, color: "var(--success)",
      background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)",
      borderRadius: "100px", padding: "5px 12px", letterSpacing: "0.02em",
    }}>
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", display: "inline-block" }} className="animate-pulse-dot" />
      Early Access Open
    </span>
  );
}

const ASSETS = [
  { name: "payment-api-prod", type: "Application", risk: "HIGH",     badge: "#f59e0b", review: "Due in 3d"  },
  { name: "postgres-primary", type: "Database",    risk: "CRITICAL", badge: "#ef4444", review: "Overdue"    },
  { name: "nginx-gateway",    type: "Server",      risk: "MEDIUM",   badge: "#6d56fa", review: "✓ Reviewed" },
  { name: "*.acme.com",       type: "SSL Cert",    risk: "HIGH",     badge: "#f59e0b", review: "Expiring 30d"},
];

function DashboardMock() {
  return (
    <div style={{
      background: "var(--surface-1)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px", overflow: "hidden",
      boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(109,86,250,0.1)",
    }}>
      {/* Chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        {["#ff5f57","#ffbe2e","#28c840"].map(c => <span key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />)}
        <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "8px", fontWeight: 500 }}>BYUND Governance — Asset Register</span>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {[
          { l: "Total Assets",   v: "142", s: "+4 this month" },
          { l: "Reviews Due",    v: "12",  s: "3 overdue"     },
          { l: "Open Findings",  v: "28",  s: "4 critical"    },
        ].map((m, i) => (
          <div key={m.l} style={{ padding: "16px 18px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{m.l}</p>
            <p style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", margin: "4px 0 2px" }}>{m.v}</p>
            <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>{m.s}</p>
          </div>
        ))}
      </div>

      {/* Asset list */}
      <div style={{ padding: "16px" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>Asset Register</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {ASSETS.map((a, i) => (
            <motion.div key={a.name}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08, duration: 0.35 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 12px", background: "rgba(255,255,255,0.025)",
                borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "rgba(109,86,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Server size={11} color="var(--brand-light)" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>{a.name}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>{a.type}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: a.badge, background: `${a.badge}18`, border: `1px solid ${a.badge}35`, borderRadius: "4px", padding: "2px 7px" }}>{a.risk}</span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{a.review}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "80px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 40%, transparent 100%)",
      }} />

      {/* Glow orbs */}
      <div className="glow-blob" style={{ width: "700px", height: "700px", top: "-200px", left: "50%", transform: "translateX(-50%)" }} />
      <div className="glow-blob" style={{ width: "350px", height: "350px", bottom: "0", right: "-80px", background: "radial-gradient(circle, rgba(79,61,212,0.18) 0%, transparent 70%)" }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "64px", alignItems: "center" }} className="lg:grid-cols-2">

          {/* Copy */}
          <div style={{ maxWidth: "580px" }}>
            <motion.div variants={FADE(0)} initial="hidden" animate="show" style={{ marginBottom: "24px" }}>
              <LiveDot />
            </motion.div>

            <motion.h1 variants={FADE(1)} initial="hidden" animate="show"
              style={{ fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: "24px" }}
            >
              Infrastructure{" "}
              <span className="text-gradient">you can</span>
              <br />
              actually trust.
            </motion.h1>

            <motion.p variants={FADE(2)} initial="hidden" animate="show"
              style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: "470px", marginBottom: "36px", letterSpacing: "-0.01em" }}
            >
              BYUND gives IT teams a single source of truth for every asset they own —
              who owns it, when it was last reviewed, and what needs attention right now.
            </motion.p>

            <motion.div variants={FADE(3)} initial="hidden" animate="show"
              style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "44px" }}
            >
              <Link href="/#waitlist" className="btn btn-primary btn-lg" style={{ gap: "8px" }}>
                Join the Waitlist <ArrowRight size={16} />
              </Link>
              <Link href="/governance" className="btn btn-ghost btn-lg">
                See Governance →
              </Link>
            </motion.div>

            <motion.div variants={FADE(4)} initial="hidden" animate="show"
              style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
            >
              {[
                { icon: <ShieldCheck size={13} />, text: "Enterprise-grade security" },
                { icon: <Server size={13} />,       text: "9 asset types" },
                { icon: <FileSearch size={13} />,   text: "Full audit trail" },
              ].map(t => (
                <span key={t.text} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
                  <span style={{ color: "var(--brand-light)" }}>{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Dashboard mock */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:block"
          >
            <DashboardMock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
