"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const TIERS = [
  {
    name: "Starter",
    price: "Free",
    sub: "During early access",
    desc: "Perfect for small IT teams getting their first asset register in order.",
    features: [
      "Up to 50 assets",
      "3 users",
      "Monthly & quarterly reviews",
      "Basic findings tracking",
      "Evidence uploads (1 GB)",
      "Activity log (30 days)",
    ],
    cta: "Join Waitlist",
    href: "/#waitlist",
    primary: false,
  },
  {
    name: "Growth",
    price: "Coming Soon",
    sub: "Pricing to be announced",
    desc: "For growing teams that need full governance workflows and team collaboration.",
    features: [
      "Unlimited assets",
      "Unlimited users",
      "All review frequencies",
      "Full findings & evidence workflow",
      "Storage 25 GB",
      "Activity log (1 year)",
      "Email notifications",
      "Manager approval workflows",
    ],
    cta: "Get Notified",
    href: "/#waitlist",
    primary: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "Talk to us",
    desc: "For enterprises, banks, and MSPs needing custom contracts and dedicated support.",
    features: [
      "Everything in Growth",
      "SSO / SAML (v1.1)",
      "Dedicated onboarding",
      "Custom data retention",
      "SLA guarantee",
      "Priority support",
    ],
    cta: "Contact Us",
    href: "mailto:hello@nippysky.com",
    primary: false,
  },
];

export default function Pricing() {
  return (
    <section className="section" id="pricing" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", maxWidth: "520px", margin: "0 auto 72px" }}
        >
          <span className="label" style={{ marginBottom: "20px", display: "block" }}>Pricing</span>
          <h2 className="display-md" style={{ marginBottom: "16px" }}>
            Simple.{" "}
            <span className="text-brand">Transparent.</span>
            {" "}Fair.
          </h2>
          <p style={{ fontSize: "17px", color: "var(--text-2)", lineHeight: 1.7 }}>
            Start free during early access. Pricing is designed to scale with your team, not your ambition.
          </p>
        </motion.div>

        <div className="grid-pricing">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              style={{
                borderRadius: "20px",
                padding: "40px 36px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                background: tier.primary
                  ? "linear-gradient(145deg, var(--brand-sub2) 0%, var(--brand-sub) 100%)"
                  : "var(--surface-1)",
                border: tier.primary
                  ? "1px solid rgba(114,96,251,0.35)"
                  : "1px solid var(--border)",
              }}
            >
              {tier.primary && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: "linear-gradient(90deg, var(--brand-lo), var(--brand-hi))",
                }} />
              )}
              {tier.primary && (
                <span style={{
                  position: "absolute", top: "20px", right: "20px",
                  fontSize: "10px", fontWeight: 700, padding: "4px 10px",
                  borderRadius: "6px", background: "var(--brand-sub2)",
                  color: "var(--brand-hi)", border: "1px solid rgba(114,96,251,0.3)",
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>Popular</span>
              )}

              <p style={{
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.07em",
                textTransform: "uppercase", marginBottom: "16px",
                color: tier.primary ? "var(--brand-hi)" : "var(--text-3)",
              }}>
                {tier.name}
              </p>
              <p style={{ fontSize: "clamp(28px,3vw,40px)", fontWeight: 800, letterSpacing: "-0.045em", marginBottom: "4px", color: "var(--text-1)" }}>
                {tier.price}
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "18px" }}>{tier.sub}</p>
              <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "32px" }}>{tier.desc}</p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "11px", flex: 1, marginBottom: "36px" }}>
                {tier.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--text-2)" }}>
                    <Check size={14} color="var(--success)" style={{ marginTop: "1px", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={tier.primary ? "btn btn-primary btn-md" : "btn btn-ghost btn-md"}
                style={{ justifyContent: "center" }}
              >
                {tier.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
