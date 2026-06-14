"use client";

import { motion } from "framer-motion";
import { PlusCircle, ClipboardCheck, Bell, BarChart3 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: <PlusCircle size={20} />,
    title: "Register your assets",
    desc: "Add servers, applications, databases, SSL certificates, and more. Assign technical owners, set risk ratings and environments.",
  },
  {
    n: "02",
    icon: <ClipboardCheck size={20} />,
    title: "Schedule reviews",
    desc: "Set monthly, quarterly, or annual review cycles. BYUND automatically creates review tasks and assigns them to the right people.",
  },
  {
    n: "03",
    icon: <Bell size={20} />,
    title: "Get notified, take action",
    desc: "Reviewers are notified when action is needed. Complete reviews, upload evidence, raise findings — all in one place.",
  },
  {
    n: "04",
    icon: <BarChart3 size={20} />,
    title: "Stay audit-ready",
    desc: "Every action generates an immutable audit trail. When auditors come knocking, you have the full history at your fingertips.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 80px" }}
        >
          <span className="label" style={{ marginBottom: "20px", display: "block" }}>How it works</span>
          <h2 className="display-md" style={{ marginBottom: "16px" }}>
            From chaos to control{" "}
            <span className="text-brand">in four steps</span>
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-2)", lineHeight: 1.7 }}>
            No complex setup. No weeks of onboarding. Start seeing value in your first session.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2px" }} id="hiw-grid">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              style={{
                padding: "40px 36px",
                background: i === 0 ? "var(--brand-sub)" : "var(--surface-1)",
                border: "1px solid",
                borderColor: i === 0 ? "rgba(114,96,251,0.22)" : "var(--border)",
                borderRadius: "16px",
                position: "relative",
              }}
            >
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-hi)", letterSpacing: "0.1em", marginBottom: "20px" }}>
                {step.n}
              </p>

              <div style={{
                width: "46px", height: "46px", borderRadius: "12px",
                background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-hi)", marginBottom: "22px",
              }}>
                {step.icon}
              </div>

              <h3 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px", color: "var(--text-1)" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>{step.desc}</p>

              {i < 3 && (
                <div style={{
                  position: "absolute", right: "-14px", top: "50%", transform: "translateY(-50%)",
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "var(--bg)", border: "1px solid var(--border-med)",
                  display: "none", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: "var(--text-3)", zIndex: 2,
                }} id={`arrow-${i}`}>
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <style>{`
          @media (min-width: 768px) {
            #hiw-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 16px !important;
            }
          }
          @media (min-width: 1200px) {
            #hiw-grid {
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 2px !important;
            }
            #arrow-0, #arrow-1, #arrow-2 {
              display: flex !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
