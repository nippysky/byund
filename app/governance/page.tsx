"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FinalCTA from "@/components/landing/FinalCTA";
import {
  ShieldCheck, Server, Database, Globe, Lock,
  ArrowRight, Check, Clock, FileText, Users, Activity,
  AlertTriangle, BarChart3, Bell
} from "lucide-react";

const FADE = (i: number) => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] as const },
  },
});

const ASSET_TYPES = [
  { icon: <Server size={16} />,      label: "Server"          },
  { icon: <Database size={16} />,    label: "Database"        },
  { icon: <Globe size={16} />,       label: "Website"         },
  { icon: <Lock size={16} />,        label: "SSL Certificate" },
  { icon: <ShieldCheck size={16} />, label: "Firewall"        },
  { icon: <Server size={16} />,      label: "Application"     },
  { icon: <Database size={16} />,    label: "Storage"         },
  { icon: <Server size={16} />,      label: "Switch"          },
  { icon: <Server size={16} />,      label: "Cluster"         },
];

const FEATURES = [
  {
    icon: <BarChart3 size={22} />,
    title: "Asset Register",
    desc: "A single, searchable register for every asset your organization owns. 9 types, risk ratings, environments, and ownership — all in one place.",
    bullets: ["Technical & business owners", "Risk ratings (Critical → Info)", "Environment tagging", "Custom metadata fields"],
  },
  {
    icon: <Clock size={22} />,
    title: "Scheduled Reviews",
    desc: "Set review cycles per asset and let BYUND handle the rest. Reviews are created automatically, assigned, and tracked through to approval.",
    bullets: ["Monthly, quarterly, annual cycles", "Auto-created review tasks", "Reviewer → Manager approval workflow", "Overdue detection & alerts"],
  },
  {
    icon: <AlertTriangle size={22} />,
    title: "Audit Findings",
    desc: "Raise findings during reviews or standalone. Track them from open to closed with full remediation evidence.",
    bullets: ["Severity levels (Critical to Info)", "Team & individual assignment", "Remediation plan tracking", "Evidence document uploads"],
  },
  {
    icon: <FileText size={22} />,
    title: "Evidence Management",
    desc: "Upload PDFs, DOCX, images, and spreadsheets directly against assets, reviews, or findings. Stored securely, accessible instantly.",
    bullets: ["PDF, DOCX, XLSX, PNG, JPG", "Direct MinIO / S3 storage", "Linked to assets, reviews, findings", "Presigned secure download URLs"],
  },
  {
    icon: <Users size={22} />,
    title: "Role-Based Access",
    desc: "Six precision roles — from Viewer to Governance Admin — ensure the right people see and do exactly what they should.",
    bullets: ["Super Admin, Governance Admin", "Manager, Reviewer, Auditor, Viewer", "Permission-based, not role-guessed", "Full user management"],
  },
  {
    icon: <Activity size={22} />,
    title: "Immutable Audit Trail",
    desc: "Every action — every status change, upload, approval, and login — is recorded in an immutable log that auditors can rely on.",
    bullets: ["Who did what, when", "Before/after change diffs", "Cannot be edited or deleted", "Exportable on request"],
  },
];

const WORKFLOW = [
  { n: "1", title: "Asset registered",   desc: "Technical owner, business owner, risk rating, and review frequency set." },
  { n: "2", title: "Review scheduled",   desc: "BYUND auto-creates a review task 7 days before the due date." },
  { n: "3", title: "Reviewer notified",  desc: "Email and in-app notification sent. Reviewer completes the review and uploads evidence." },
  { n: "4", title: "Manager approves",   desc: "Manager reviews the submission and approves or requests changes." },
  { n: "5", title: "Audit trail logged", desc: "Every step is recorded. The asset's next review date is automatically set." },
];

export default function GovernancePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <Header />

      {/* Hero */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
        <div className="glow-blob" style={{ width: "600px", height: "600px", top: "-150px", left: "50%", transform: "translateX(-50%)" }} />
        <div className="grid-bg" />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div variants={FADE(0)} initial="hidden" animate="show" style={{ marginBottom: "20px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              fontSize: "11px", fontWeight: 700, color: "var(--brand-hi)",
              background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.3)",
              borderRadius: "100px", padding: "5px 14px",
              letterSpacing: "0.06em", textTransform: "uppercase" as const,
            }}>
              <ShieldCheck size={11} /> BYUND Governance
            </span>
          </motion.div>

          <motion.h1 variants={FADE(1)} initial="hidden" animate="show"
            className="display-lg"
            style={{ maxWidth: "760px", marginBottom: "24px" }}
          >
            Know what you own.<br />
            <span className="text-brand">Know who owns it.</span>
          </motion.h1>

          <motion.p variants={FADE(2)} initial="hidden" animate="show"
            style={{ fontSize: "18px", color: "var(--text-2)", lineHeight: 1.7, maxWidth: "540px", marginBottom: "36px" }}
          >
            BYUND Governance is the asset ownership, review, and audit platform for modern IT teams.
            Stop managing infrastructure in spreadsheets. Start governing it properly.
          </motion.p>

          <motion.div variants={FADE(3)} initial="hidden" animate="show"
            style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "56px" }}
          >
            <Link href="/#waitlist" className="btn btn-primary btn-lg">
              Join the Waitlist <ArrowRight size={16} />
            </Link>
            <Link href="/#pricing" className="btn btn-ghost btn-lg">
              See Pricing
            </Link>
          </motion.div>

          {/* Asset type pills */}
          <motion.div variants={FADE(4)} initial="hidden" animate="show">
            <p className="label" style={{ marginBottom: "14px" }}>9 asset types supported</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {ASSET_TYPES.map(a => (
                <span key={a.label} style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "100px",
                  fontSize: "13px", fontWeight: 500, color: "var(--text-2)",
                  background: "var(--surface-1)", border: "1px solid var(--border-med)",
                }}>
                  <span style={{ color: "var(--brand-hi)" }}>{a.icon}</span>
                  {a.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ textAlign: "center", maxWidth: "520px", margin: "0 auto 72px" }}
          >
            <span className="label" style={{ marginBottom: "20px", display: "block" }}>Core Modules</span>
            <h2 className="display-md" style={{ marginBottom: "14px" }}>
              Everything governance needs.{" "}
              <span className="text-brand">Nothing it doesn&apos;t.</span>
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7 }}>
              Six modules that work together to give your team complete visibility and control.
            </p>
          </motion.div>

          <div className="grid-features">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                className="glass-card"
                style={{ padding: "36px" }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "13px",
                  background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-hi)", marginBottom: "20px",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px", color: "var(--text-1)" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "20px" }}>{f.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {f.bullets.map(b => (
                    <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--text-3)" }}>
                      <Check size={13} color="var(--success)" style={{ marginTop: "2px", flexShrink: 0 }} /> {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Workflow */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="grid-split">
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="label" style={{ marginBottom: "20px", display: "block" }}>Review Workflow</span>
              <h2 className="display-sm" style={{ marginBottom: "16px" }}>
                Reviews that actually<br />get completed.
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "40px" }}>
                BYUND turns review governance from a stressful manual process into a
                structured, trackable workflow that managers and auditors can rely on.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {WORKFLOW.map((w, i) => (
                  <div key={w.n} style={{ display: "flex", gap: "20px", position: "relative" }}>
                    {i < WORKFLOW.length - 1 && (
                      <div style={{
                        position: "absolute", left: "17px", top: "44px", bottom: 0,
                        width: "1px", background: "rgba(114,96,251,0.2)",
                      }} />
                    )}
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
                      background: i === 0 ? "var(--brand)" : "var(--brand-sub2)",
                      border: "1px solid rgba(114,96,251,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 700,
                      color: i === 0 ? "#fff" : "var(--brand-hi)",
                      zIndex: 1,
                    }}>
                      {w.n}
                    </div>
                    <div style={{ paddingBottom: "28px" }}>
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.02em", marginBottom: "4px" }}>{w.title}</p>
                      <p style={{ fontSize: "13px", color: "var(--text-3)", lineHeight: 1.65 }}>{w.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Notification preview panel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.15, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            >
              <div style={{ background: "var(--surface-1)", borderRadius: "20px", overflow: "hidden", border: "1px solid var(--border-med)" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Bell size={16} color="var(--brand-hi)" />
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>Notifications</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 700, background: "var(--brand)", color: "#fff", borderRadius: "100px", padding: "2px 8px" }}>4</span>
                </div>
                {[
                  { icon: "🔴", title: "Review Overdue",       sub: "postgres-primary · Q2 2026 Review",  time: "2h ago"   },
                  { icon: "🟡", title: "Review Due in 3 days", sub: "payment-api-prod · Quarterly Review", time: "today"    },
                  { icon: "🟣", title: "Finding Assigned",     sub: "SSL cert vulnerability · Critical",   time: "yesterday"},
                  { icon: "🟢", title: "Review Approved",      sub: "nginx-gateway · Manager approved",    time: "2d ago"   },
                ].map((n, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: "14px",
                    padding: "16px 24px",
                    borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                    background: i === 0 ? "rgba(239,68,68,0.04)" : "transparent",
                  }}>
                    <span style={{ fontSize: "18px", flexShrink: 0, lineHeight: 1 }}>{n.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)", marginBottom: "2px" }}>{n.title}</p>
                      <p style={{ fontSize: "12px", color: "var(--text-3)", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{n.sub}</p>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-3)", flexShrink: 0 }}>{n.time}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--surface-1)", borderRadius: "16px", padding: "24px", marginTop: "16px", border: "1px solid var(--border-med)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "6px", padding: "3px 8px" }}>CRITICAL</span>
                  <span style={{ fontSize: "11px", color: "var(--text-3)" }}>Finding #F-0042</span>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "6px", color: "var(--text-1)" }}>Expired SSL certificate on api.payment.prod</p>
                <p style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.65, marginBottom: "16px" }}>Certificate expired 14 days ago. Immediate renewal required. Assigned to DevOps team.</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-3)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "4px 10px" }}>DevOps Team</span>
                  <span style={{ fontSize: "11px", color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "6px", padding: "4px 10px" }}>Due in 2 days</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  );
}
