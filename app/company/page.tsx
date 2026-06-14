"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Target, Zap, Shield, Users } from "lucide-react";

const FADE = (i: number) => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] as const },
  },
});

const VALUES = [
  {
    icon: <Target size={20} />,
    title: "Clarity over complexity",
    desc: "Every feature we build must make something clearer — not add more to manage. If it doesn't reduce ambiguity, it doesn't ship.",
  },
  {
    icon: <Shield size={20} />,
    title: "Built for trust",
    desc: "Our customers are IT teams, MSPs, and fintechs who need software they can bet their audits on. We take that responsibility seriously.",
  },
  {
    icon: <Zap size={20} />,
    title: "Speed with permanence",
    desc: "We move fast to build what customers need, but we build it in a way that doesn't need to be rebuilt. No shortcuts on architecture.",
  },
  {
    icon: <Users size={20} />,
    title: "Customer-shaped roadmap",
    desc: "Our roadmap is shaped by the people using the product. Early access members directly influence what we build next.",
  },
];

export default function CompanyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <Header />

      {/* Hero */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
        <div className="glow-blob" style={{ width: "500px", height: "500px", top: "-100px", left: "50%", transform: "translateX(-50%)", opacity: 0.6 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div variants={FADE(0)} initial="hidden" animate="show" style={{ marginBottom: "20px" }}>
            <span style={{
              display: "inline-block",
              fontSize: "11px", fontWeight: 700,
              padding: "5px 14px", borderRadius: "100px",
              background: "var(--surface-2)", color: "var(--text-3)",
              border: "1px solid var(--border-med)",
              letterSpacing: "0.06em", textTransform: "uppercase" as const,
            }}>About BYUND</span>
          </motion.div>
          <motion.h1 variants={FADE(1)} initial="hidden" animate="show"
            className="display-lg"
            style={{ maxWidth: "700px", marginBottom: "24px" }}
          >
            We build tools for<br />
            <span className="text-brand">the teams that keep things running.</span>
          </motion.h1>
          <motion.p variants={FADE(2)} initial="hidden" animate="show"
            style={{ fontSize: "18px", color: "var(--text-2)", lineHeight: 1.7, maxWidth: "520px" }}
          >
            BYUND is a product of NIPPYSKY LIMITED — a technology company building modern
            governance and infrastructure tooling for IT teams across Africa and beyond.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="grid-split">
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="label" style={{ marginBottom: "24px", display: "block" }}>Our Mission</span>
              <h2 className="display-sm" style={{ marginBottom: "20px" }}>
                Help organizations know what assets they own — and prove it.
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "20px" }}>
                Most IT teams are flying blind. Assets live in spreadsheets, Notion pages, and someone&apos;s
                memory. When an auditor asks &ldquo;show me your asset register and review history&rdquo;, the answer
                is usually painful.
              </p>
              <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "20px" }}>
                We started BYUND because we&apos;ve lived that pain. We know what it&apos;s like to scramble
                before an audit. We know what it costs when a certificate expires because nobody
                was tracking it.
              </p>
              <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7 }}>
                BYUND Governance exists to change that — for every IT team, MSP, and fintech
                that deserves enterprise-grade tooling without enterprise-grade complexity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.15, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                { label: "Company",   value: "NIPPYSKY LIMITED"           },
                { label: "Product",   value: "BYUND Governance"           },
                { label: "Stage",     value: "Early Access — Building v1" },
                { label: "Target",    value: "IT Teams, MSPs, Fintechs"   },
                { label: "Region",    value: "Nigeria · Africa · Global"  },
              ].map(row => (
                <div key={row.label} style={{
                  borderRadius: "14px", padding: "18px 24px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "var(--surface-1)", border: "1px solid var(--border)",
                }}>
                  <span style={{ fontSize: "13px", color: "var(--text-3)", fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: "14px", color: "var(--text-1)", fontWeight: 600, letterSpacing: "-0.01em" }}>{row.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ maxWidth: "480px", marginBottom: "64px" }}
          >
            <span className="label" style={{ marginBottom: "20px", display: "block" }}>What we believe</span>
            <h2 className="display-sm">The principles we build with</h2>
          </motion.div>

          <div className="grid-2">
            {VALUES.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                className="glass-card"
                style={{ padding: "40px" }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-hi)", marginBottom: "20px",
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px", color: "var(--text-1)" }}>{v.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            style={{
              maxWidth: "680px", margin: "0 auto",
              padding: "48px",
              background: "linear-gradient(145deg, var(--brand-sub2) 0%, var(--brand-sub) 60%, transparent 100%)",
              border: "1px solid rgba(114,96,251,0.2)",
              borderRadius: "24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "180px", height: "180px", borderRadius: "50%",
              background: "radial-gradient(circle, var(--brand-sub) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{ fontSize: "44px", color: "var(--brand-hi)", lineHeight: 0.8, marginBottom: "20px", fontFamily: "Georgia, serif", opacity: 0.5 }}>&ldquo;</p>
            <p style={{ fontSize: "18px", color: "var(--text-2)", lineHeight: 1.8, marginBottom: "32px", fontStyle: "italic", position: "relative" }}>
              I built BYUND because I couldn&apos;t find a governance tool that was both
              powerful enough for a serious IT team and simple enough for a team of five to actually use.
              Everything was either a $50,000-a-year enterprise platform or a basic spreadsheet template.
              There was nothing in between. That&apos;s the gap we&apos;re filling.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--brand-hi), var(--brand-lo))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", fontWeight: 800, color: "#fff",
              }}>
                N
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)" }}>NIPPY</p>
                <p style={{ fontSize: "12px", color: "var(--text-3)" }}>Founder, NIPPYSKY LIMITED</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 className="display-sm" style={{ marginBottom: "16px" }}>
              Ready to take governance seriously?
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-2)", marginBottom: "36px" }}>
              Join the waitlist and be first when BYUND Governance launches.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/#waitlist" className="btn btn-primary btn-lg">
                Join the Waitlist <ArrowRight size={15} />
              </Link>
              <Link href="/governance" className="btn btn-ghost btn-lg">
                See Governance Product
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
