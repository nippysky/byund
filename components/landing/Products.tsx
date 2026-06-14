"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function Products() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", maxWidth: "520px", margin: "0 auto 72px" }}
        >
          <span className="label" style={{ marginBottom: "20px", display: "block" }}>Our Products</span>
          <h2 className="display-md" style={{ marginBottom: "16px" }}>
            One brand.{" "}
            <span className="text-brand">Multiple products.</span>
            <br />One mission.
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-2)", lineHeight: 1.7 }}>
            BYUND is built to be the platform suite IT teams rely on. Governance is just the beginning.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid-products">
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
              background: "linear-gradient(145deg, var(--brand-sub2) 0%, var(--brand-sub) 60%, transparent 100%)",
              border: "1px solid rgba(114,96,251,0.28)",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: "-60px", right: "-60px",
              width: "260px", height: "260px", borderRadius: "50%",
              background: "radial-gradient(circle, var(--brand-sub) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "11px", fontWeight: 700, color: "var(--brand-hi)",
                background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.3)",
                borderRadius: "100px", padding: "5px 12px", marginBottom: "28px",
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-hi)", display: "inline-block" }} />
                Launching First
              </div>

              <div style={{
                width: "64px", height: "64px", borderRadius: "16px",
                background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-hi)", marginBottom: "24px",
              }}>
                <ShieldCheck size={28} />
              </div>

              <h3 className="display-sm" style={{ marginBottom: "8px" }}>BYUND Governance</h3>
              <p style={{ fontSize: "14px", color: "var(--brand-hi)", fontWeight: 600, marginBottom: "16px" }}>
                Asset Ownership, Reviews & Audit Governance
              </p>
              <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "32px", maxWidth: "380px" }}>
                Know what assets you own, who owns them, when they were last reviewed,
                and what audit findings need resolution.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
                {["Asset Register", "Review Workflows", "Audit Findings", "Evidence Uploads", "Activity Logs"].map(t => (
                  <span key={t} style={{
                    fontSize: "12px", fontWeight: 600, padding: "4px 11px",
                    borderRadius: "6px", background: "var(--brand-sub2)",
                    color: "var(--brand-hi)", border: "1px solid rgba(114,96,251,0.2)",
                  }}>{t}</span>
                ))}
              </div>

              <Link href="/governance" className="btn btn-primary btn-md">
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
            className="glass-card"
            style={{
              padding: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "400px",
            }}
          >
            <div>
              <span style={{
                display: "inline-block", fontSize: "11px", fontWeight: 700,
                padding: "4px 12px", borderRadius: "6px", background: "var(--surface-2)",
                color: "var(--text-3)", border: "1px solid var(--border-med)",
                letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "28px",
              }}>Coming Soon</span>

              <div style={{
                width: "64px", height: "64px", borderRadius: "16px",
                background: "var(--surface-2)", border: "1px solid var(--border-med)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-3)", marginBottom: "24px",
              }}>
                <Sparkles size={26} />
              </div>

              <h3 className="display-sm" style={{ color: "var(--text-2)", marginBottom: "16px" }}>
                More products<br />are in the works.
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-3)", lineHeight: 1.7, maxWidth: "320px" }}>
                We&apos;re building a suite of tools for modern IT teams. Governance is the first step.
                What comes next depends on what the community needs.
              </p>
            </div>

            <Link href="/#waitlist" style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "14px", fontWeight: 600, color: "var(--text-2)",
              marginTop: "36px", transition: "color 0.15s ease",
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-2)")}
            >
              Join the waitlist to influence the roadmap <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
