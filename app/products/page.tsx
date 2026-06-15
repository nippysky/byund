"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ShieldCheck } from "lucide-react";

// ── SSO URLs ─────────────────────────────────────────────────────────────────
const ACCOUNTS_URL    = process.env.NEXT_PUBLIC_ACCOUNTS_URL    ?? "https://byund-accounts.vercel.app";
const GOVERNANCE_URL  = process.env.NEXT_PUBLIC_GOVERNANCE_URL  ?? "https://byund-governance.vercel.app";

function ssoLink(dest: string) {
  return `${ACCOUNTS_URL}/login?next=${encodeURIComponent(dest)}`;
}

// ── Animation ─────────────────────────────────────────────────────────────────
const FADE = (i: number) => ({
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] as const },
  },
});

// ── Product catalogue (shared source of truth) ────────────────────────────────
const PRODUCTS = [
  {
    slug:      "governance",
    // Live: routes through SSO login, lands in Governance after auth
    href:      ssoLink(GOVERNANCE_URL),
    ctaLabel:  "Open Governance",
    icon:      <ShieldCheck size={28} strokeWidth={1.6} />,
    iconColor: "#7260fb",
    iconBg:    "rgba(114,96,251,0.1)",
    tag:       "Live now",
    tagColor:  "#22c55e",
    name:      "Governance",
    tagline:   "IT asset ownership, review scheduling & audit readiness.",
    description:
      "Know exactly what your organisation owns, who owns it, and when each asset was last reviewed. Governance gives teams a single register for every IT asset — servers, databases, certificates, applications — with built-in review cycles, findings tracking, and a complete compliance audit trail.",
    highlights: [
      "Asset register with 9 asset types",
      "Automated review scheduling",
      "Findings & risk management",
      "Evidence uploads & audit trail",
      "Role-based access control",
    ],
  },
  {
    slug:      "analytics",
    href:      null,
    ctaLabel:  "In development",
    icon:      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3v18h18"/><path d="M18 9l-5 5-3-3-4 4"/></svg>,
    iconColor: "#06b6d4",
    iconBg:    "rgba(6,182,212,0.1)",
    tag:       "Coming soon",
    tagColor:  "var(--text-3)",
    name:      "Analytics",
    tagline:   "Business intelligence and reporting across all BYUND data.",
    description:
      "Unified dashboards and custom reports that surface insights from every BYUND module. From asset risk trends to review completion rates — all the data, none of the spreadsheets.",
    highlights: [
      "Cross-module dashboards",
      "Custom report builder",
      "Trend analysis & forecasting",
      "CSV & PDF exports",
      "Scheduled email digests",
    ],
  },
  {
    slug:      "hr",
    href:      null,
    ctaLabel:  "In development",
    icon:      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>,
    iconColor: "#f59e0b",
    iconBg:    "rgba(245,158,11,0.1)",
    tag:       "Coming soon",
    tagColor:  "var(--text-3)",
    name:      "People",
    tagline:   "HR, org charts, and workforce management for modern teams.",
    description:
      "From onboarding to offboarding — manage your people with the same rigour you manage your systems. Integrated with Governance for seamless asset ownership handoffs when team members change.",
    highlights: [
      "Employee directory & org chart",
      "Onboarding & offboarding workflows",
      "Asset ownership handoffs",
      "Leave & time-off management",
      "Performance review cycles",
    ],
  },
];

export default function ProductsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--text-primary)" }}>
      <Header />

      <main>
        {/* Hero */}
        <section style={{ padding: "96px 24px 72px", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <motion.p
            variants={FADE(0)} initial="hidden" animate="show"
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 16, opacity: 0.85 }}
          >
            BYUND Products
          </motion.p>
          <motion.h1
            variants={FADE(1)} initial="hidden" animate="show"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.05, marginBottom: 20 }}
          >
            Everything your organisation needs.<br />
            <span style={{ color: "var(--brand)" }}>One account for all of it.</span>
          </motion.h1>
          <motion.p
            variants={FADE(2)} initial="hidden" animate="show"
            style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.7 }}
          >
            BYUND is a growing suite of business tools built to work together. Start with Governance — more products unlock as your team grows.
          </motion.p>
        </section>

        {/* Product cards */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 100px", display: "flex", flexDirection: "column", gap: 24 }}>
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.slug}
              variants={FADE(i + 3)} initial="hidden" animate="show"
              style={{
                borderRadius: 24,
                border: "1px solid var(--border)",
                background: "var(--card-bg, var(--surface))",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "36px 40px", display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
                {/* Left */}
                <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                      background: product.iconBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: product.iconColor,
                    }}>
                      {product.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>{product.name}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
                        color: product.tagColor,
                        background: product.tagColor === "#22c55e" ? "rgba(34,197,94,0.1)" : "var(--surface-2)",
                        padding: "2px 8px", borderRadius: 99,
                      }}>
                        {product.tag}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                    {product.description}
                  </p>
                  {product.href ? (
                    <Link href={product.href} style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 700, color: "var(--brand)",
                      textDecoration: "none",
                    }}>
                      {product.ctaLabel} <ArrowRight size={13} />
                    </Link>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "italic" }}>
                      {product.ctaLabel}
                    </span>
                  )}
                </div>

                {/* Right — highlights */}
                <div style={{
                  flex: "0 0 240px", background: "var(--surface-2, rgba(0,0,0,0.03))",
                  borderRadius: 16, padding: "20px 22px",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14 }}>
                    What's included
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {product.highlights.map(h => (
                      <li key={h} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-primary)" }}>
                        <span style={{ color: product.iconColor, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", padding: "0 24px 100px" }}>
          <motion.div variants={FADE(7)} initial="hidden" animate="show">
            <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 24 }}>
              Ready to get started with BYUND Governance?
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={ssoLink(GOVERNANCE_URL)} style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 14, fontWeight: 700,
                background: "var(--brand)", color: "#fff",
                padding: "12px 24px", borderRadius: 12, textDecoration: "none",
              }}>
                Open Governance <ArrowRight size={14} />
              </Link>
              <Link href="/contact" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 14, fontWeight: 600,
                border: "1px solid var(--border)", color: "var(--text-primary)",
                padding: "12px 24px", borderRadius: 12, textDecoration: "none",
              }}>
                Talk to sales
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
