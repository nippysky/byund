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
      "Evidence uploads (1GB)",
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
      "Storage 25GB",
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
    <section className="section" id="pricing">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", maxWidth: "520px", margin: "0 auto 64px" }}
        >
          <span className="badge badge-brand" style={{ marginBottom: "20px" }}>Pricing</span>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "14px" }}>
            Simple. Transparent. Fair.
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
            Start free during early access. Pricing is designed to scale with your team,
            not your ambition.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)", gap: "16px", maxWidth: "1000px", margin: "0 auto" }} className="md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              style={{
                borderRadius: "20px",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                background: tier.primary
                  ? "linear-gradient(145deg, rgba(109,86,250,0.14) 0%, rgba(109,86,250,0.05) 100%)"
                  : "rgba(255,255,255,0.025)",
                border: tier.primary
                  ? "1px solid rgba(109,86,250,0.35)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {tier.primary && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--brand-dark), var(--brand-light))" }} />
              )}
              {tier.primary && (
                <span className="badge badge-brand" style={{ position: "absolute", top: "20px", right: "20px", fontSize: "10px" }}>Popular</span>
              )}

              <p style={{ fontSize: "13px", fontWeight: 700, color: tier.primary ? "var(--brand-light)" : "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
                {tier.name}
              </p>
              <p style={{ fontSize: "clamp(28px,3vw,38px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "4px" }}>{tier.price}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>{tier.sub}</p>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "28px" }}>{tier.desc}</p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", flex: 1, marginBottom: "32px" }}>
                {tier.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <Check size={14} color="var(--success)" style={{ marginTop: "1px", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={tier.primary ? "btn btn-primary btn-md" : "btn btn-ghost btn-md"}
                style={{ justifyContent: "center", gap: "8px" }}
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
