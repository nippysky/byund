"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function Products() {
  return (
    <section className="section">
      <div className="divider" />
      <div className="container" style={{ paddingTop: "96px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto 64px" }}
        >
          <span className="badge badge-brand" style={{ marginBottom: "20px" }}>Our Products</span>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
            One brand. Multiple products. One mission.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            BYUND is built to be the platform suite IT teams rely on. Governance is just the beginning.
          </p>
        </motion.div>

        {/* Product cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }} className="md:grid-cols-2">

          {/* Governance — primary */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: "relative",
              borderRadius: "24px",
              padding: "48px",
              background: "linear-gradient(145deg, rgba(109,86,250,0.12) 0%, rgba(109,86,250,0.04) 60%, rgba(6,8,16,0) 100%)",
              border: "1px solid rgba(109,86,250,0.28)",
              overflow: "hidden",
            }}
          >
            {/* Glow */}
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(109,86,250,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "11px", fontWeight: 700, color: "var(--brand-light)",
                background: "rgba(109,86,250,0.12)", border: "1px solid rgba(109,86,250,0.3)",
                borderRadius: "100px", padding: "5px 12px", marginBottom: "28px",
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-light)", display: "inline-block" }} className="animate-pulse-dot" />
                Launching First
              </div>

              <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(155,139,251,0.3), rgba(109,86,250,0.2))",
                border: "1px solid rgba(109,86,250,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-light)", marginBottom: "24px",
              }}>
                <ShieldCheck size={28} />
              </div>

              <h3 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "8px" }}>
                BYUND Governance
              </h3>
              <p style={{ fontSize: "13px", color: "var(--brand-light)", fontWeight: 600, marginBottom: "16px", letterSpacing: "-0.01em" }}>
                Asset Ownership, Reviews & Audit Governance
              </p>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "32px", maxWidth: "360px" }}>
                Know what assets you own, who owns them, when they were last reviewed,
                and what audit findings need resolution.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
                {["Asset Register", "Review Workflows", "Audit Findings", "Evidence Uploads", "Activity Logs"].map(t => (
                  <span key={t} className="badge badge-brand">{t}</span>
                ))}
              </div>

              <Link href="/governance" className="btn btn-primary btn-md" style={{ gap: "8px" }}>
                Explore Governance <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>

          {/* Coming soon */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{
              borderRadius: "24px",
              padding: "48px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "400px",
            }}
          >
            <div>
              <span className="badge badge-neutral" style={{ marginBottom: "28px" }}>Coming Soon</span>

              <div style={{
                width: "60px", height: "60px", borderRadius: "16px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-muted)", marginBottom: "24px",
              }}>
                <Sparkles size={26} />
              </div>

              <h3 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "12px", color: "var(--text-secondary)" }}>
                More products
                <br />are in the works.
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.65, maxWidth: "300px" }}>
                We&apos;re building a suite of tools for modern IT teams. Governance is the first step.
                What comes next depends on what the community needs.
              </p>
            </div>

            <Link href="/#waitlist"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)",
                marginTop: "36px", transition: "color 0.15s ease",
              }}
            >
              Join the waitlist to influence the roadmap <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
