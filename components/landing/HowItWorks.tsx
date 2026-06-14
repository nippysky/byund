"use client";

import { motion } from "framer-motion";
import { PlusCircle, ClipboardCheck, Bell, BarChart3 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: <PlusCircle size={20} />,
    title: "Register your assets",
    desc: "Add servers, applications, databases, SSL certificates, and more. Assign technical and business owners, set risk ratings and environments.",
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
    <section className="section">
      <div className="divider" />
      <div className="container" style={{ paddingTop: "96px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 72px" }}
        >
          <span className="badge badge-brand" style={{ marginBottom: "20px" }}>How it works</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
            From chaos to control in four steps
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            No complex setup. No weeks of onboarding. Start seeing value in your first session.
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: "2px" }} className="md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              style={{
                padding: "36px 32px",
                background: i === 0 ? "rgba(109,86,250,0.06)" : "rgba(255,255,255,0.02)",
                border: "1px solid",
                borderColor: i === 0 ? "rgba(109,86,250,0.2)" : "rgba(255,255,255,0.06)",
                borderRadius: i === 0 ? "16px 0 0 16px" : i === 3 ? "0 16px 16px 0" : "0",
                position: "relative",
              }}
              className="!rounded-2xl md:!rounded-none"
            >
              {/* Step number */}
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--brand-light)", letterSpacing: "0.1em", marginBottom: "20px" }}>
                {step.n}
              </p>

              {/* Icon */}
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "var(--brand-subtle2)", border: "1px solid rgba(109,86,250,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--brand-light)", marginBottom: "20px",
              }}>
                {step.icon}
              </div>

              <h3 style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px", color: "var(--text-primary)" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                {step.desc}
              </p>

              {/* Connector arrow */}
              {i < 3 && (
                <div className="hidden lg:flex" style={{
                  position: "absolute", right: "-14px", top: "50%", transform: "translateY(-50%)",
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "var(--background)", border: "1px solid rgba(255,255,255,0.08)",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "12px", color: "var(--text-muted)", zIndex: 2,
                }}>
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
