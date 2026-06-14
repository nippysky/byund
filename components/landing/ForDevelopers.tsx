"use client";

import { motion } from "framer-motion";
import { Activity, Lock, RefreshCw, Database } from "lucide-react";

const STATS = [
  { value: "9",    label: "Asset Types Supported", icon: <Database size={18} /> },
  { value: "6",    label: "Access Roles",           icon: <Lock size={18} /> },
  { value: "100%", label: "Audit Trail Coverage",   icon: <Activity size={18} /> },
  { value: "4",    label: "Review Frequencies",     icon: <RefreshCw size={18} /> },
];

export default function ForDevelopers() {
  return (
    <section className="section-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "2px" }} className="md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "40px 24px", textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <div style={{ color: "var(--brand-light)", marginBottom: "12px", opacity: 0.8 }}>{s.icon}</div>
              <p style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }} className="text-gradient">
                {s.value}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px", fontWeight: 500 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
