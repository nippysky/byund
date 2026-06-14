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
    <section className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ maxWidth: "560px", marginBottom: "64px" }}
        >
          <span className="badge badge-brand" style={{ marginBottom: "20px" }}>Built for</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
            Teams that run<br className="hidden md:block" /> real infrastructure
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            If your team owns infrastructure and worries about what happens when an auditor asks
            "show me your asset register", BYUND is built for you.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)", gap: "16px" }} className="md:grid-cols-2">
          {SEGMENTS.map((seg, i) => (
            <motion.div
              key={seg.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              className="glass glass-hover"
              style={{
                borderRadius: "20px",
                padding: "36px",
                cursor: "default",
              }}
            >
              {/* Icon */}
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "var(--brand-subtle2)", border: "1px solid rgba(109,86,250,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-light)", marginBottom: "24px",
              }}>
                {seg.icon}
              </div>

              <h3 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px" }}>{seg.title}</h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "24px" }}>{seg.desc}</p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {seg.tags.map(t => (
                  <span key={t} className="badge badge-neutral">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
