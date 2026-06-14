"use client";

import { motion } from "framer-motion";
import { Building2, Cpu, Landmark, Briefcase } from "lucide-react";

const SEGMENTS = [
  {
    icon: <Building2 size={22} />,
    title: "Software Companies",
    desc: "Track every service, database, and certificate you run. Keep engineering and exec teams on the same page about risk.",
    tags: ["Applications", "APIs", "SSL Certs", "Databases"],
  },
  {
    icon: <Briefcase size={22} />,
    title: "Managed Service Providers",
    desc: "Manage governance across all your clients from a single platform. Never miss a review or let a certificate expire.",
    tags: ["Multi-client", "Review Schedules", "Findings", "Evidence"],
  },
  {
    icon: <Landmark size={22} />,
    title: "Fintech Startups",
    desc: "Prepare for CBN, SOC2, and PCI-DSS audits with a clean asset register and documented review history.",
    tags: ["Audit Readiness", "Compliance", "Activity Logs", "Risk Ratings"],
  },
  {
    icon: <Cpu size={22} />,
    title: "Technology Departments",
    desc: "Give your CTO and board visibility into the IT estate without spreadsheets, Notion docs, or tribal knowledge.",
    tags: ["Servers", "Switches", "Firewalls", "Clusters"],
  },
];

export default function WhoItsFor() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ maxWidth: "580px", marginBottom: "72px" }}
        >
          <span className="label" style={{ marginBottom: "20px", display: "block" }}>Built for</span>
          <h2 className="display-md" style={{ marginBottom: "16px" }}>
            Teams that run{" "}
            <span className="text-brand">real infrastructure</span>
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-2)", lineHeight: 1.7 }}>
            If your team owns infrastructure and worries about what happens when an auditor asks
            "show me your asset register" — BYUND is built for you.
          </p>
        </motion.div>

        <div className="grid-2">
          {SEGMENTS.map((seg, i) => (
            <motion.div
              key={seg.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card"
              style={{ padding: "40px", cursor: "default" }}
            >
              <div style={{
                width: "54px", height: "54px", borderRadius: "14px",
                background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-hi)", marginBottom: "24px",
              }}>
                {seg.icon}
              </div>

              <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "12px", color: "var(--text-1)" }}>
                {seg.title}
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "24px" }}>
                {seg.desc}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {seg.tags.map(t => (
                  <span key={t} style={{
                    fontSize: "12px", fontWeight: 600, padding: "4px 11px",
                    borderRadius: "6px", background: "var(--surface-2)",
                    color: "var(--text-2)", border: "1px solid var(--border-med)",
                  }}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
