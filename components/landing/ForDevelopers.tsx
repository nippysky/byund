"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STATS = [
  { n: "9",   unit: "",   label: "Asset types tracked",   sub: "Server to SSL cert"        },
  { n: "100", unit: "%",  label: "Audit trail coverage",  sub: "Every action logged"       },
  { n: "<48", unit: "h",  label: "Setup to first review", sub: "No professional services"  },
  { n: "∞",   unit: "",   label: "Teams & users",         sub: "RBAC roles built in"       },
];

export default function ForDevelopers() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "72px" }}
        >
          <span className="label" style={{ marginBottom: "16px", display: "block" }}>By the numbers</span>
          <h2 className="display-md" style={{ maxWidth: "580px", margin: "0 auto 18px" }}>
            Built for teams that{" "}
            <span className="text-brand">move fast</span>
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-2)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            BYUND Governance is engineered to be lightweight, fast to deploy, and scalable from 10 to 10,000 assets.
          </p>
        </motion.div>

        <div
          className="grid-4-stats"
          style={{ border: "1px solid var(--border)", borderRadius: "20px", overflow: "hidden" }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              style={{
                padding: "48px 36px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                background: "var(--surface-1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at top left, var(--brand-sub) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "10px" }}>
                  <span style={{
                    fontSize: "clamp(44px, 4.5vw, 68px)",
                    fontWeight: 900,
                    letterSpacing: "-0.06em",
                    lineHeight: 1,
                    background: "linear-gradient(135deg, var(--text-1) 0%, var(--brand-hi) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    {s.n}
                  </span>
                  {s.unit && (
                    <span style={{ fontSize: "clamp(22px, 2.5vw, 34px)", fontWeight: 800, color: "var(--brand-hi)", letterSpacing: "-0.04em" }}>
                      {s.unit}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-1)", marginBottom: "6px" }}>{s.label}</p>
                <p style={{ fontSize: "13px", color: "var(--text-3)" }}>{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
