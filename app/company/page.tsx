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
    <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--text-primary)" }}>
      <Header />

      {/* Hero */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
        <div className="glow-blob" style={{ width: "500px", height: "500px", top: "-100px", left: "50%", transform: "translateX(-50%)", opacity: 0.6 }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div variants={FADE(0)} initial="hidden" animate="show" style={{ marginBottom: "20px" }}>
            <span className="badge badge-neutral">About BYUND</span>
          </motion.div>
          <motion.h1 variants={FADE(1)} initial="hidden" animate="show"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, maxWidth: "700px", marginBottom: "24px" }}
          >
            We build tools for<br />
            <span className="text-gradient">the teams that keep things running.</span>
          </motion.h1>
          <motion.p variants={FADE(2)} initial="hidden" animate="show"
            style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: "520px" }}
          >
            BYUND is a product of NIPPYSKY LIMITED — a technology company building modern
            governance and infrastructure tooling for IT teams across Africa and beyond.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="divider" />
        <div className="container" style={{ paddingTop: "96px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "80px" }} className="lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="badge badge-brand" style={{ marginBottom: "24px" }}>Our Mission</span>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "20px" }}>
                Help organizations know what assets they own — and prove it.
              </h2>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px" }}>
                Most IT teams are flying blind. Assets live in spreadsheets, Notion pages, and someone&apos;s
                memory. When an auditor asks &ldquo;show me your asset register and review history&rdquo;, the answer
                is usually painful.
              </p>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px" }}>
                We started BYUND because we&apos;ve lived that pain. We know what it&apos;s like to scramble
                before an audit. We know what it costs when a certificate expires because nobody
                was tracking it. We know that &ldquo;we have a spreadsheet for that&rdquo; is not governance.
              </p>
              <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                BYUND Governance exists to change that — for every IT team, MSP, and fintech
                that deserves enterprise-grade tooling without enterprise-grade complexity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.15, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {[
                { label: "Company",   value: "NIPPYSKY LIMITED"          },
                { label: "Product",   value: "BYUND Governance"          },
                { label: "Stage",     value: "Early Access — Building v1" },
                { label: "Target",    value: "IT Teams, MSPs, Fintechs"  },
                { label: "Region",    value: "Nigeria · Africa · Global"  },
              ].map(row => (
                <div key={row.label} className="glass" style={{ borderRadius: "14px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>{row.label}</span>
                  <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, letterSpacing: "-0.01em" }}>{row.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="divider" />
        <div className="container" style={{ paddingTop: "96px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ maxWidth: "480px", marginBottom: "56px" }}
          >
            <span className="badge badge-brand" style={{ marginBottom: "20px" }}>What we believe</span>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em" }}>
              The principles we build with
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)", gap: "16px" }} className="md:grid-cols-2">
            {VALUES.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                className="glass glass-hover"
                style={{ borderRadius: "20px", padding: "36px" }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "var(--brand-subtle2)", border: "1px solid rgba(109,86,250,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-light)", marginBottom: "20px",
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px" }}>{v.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="section">
        <div className="divider" />
        <div className="container" style={{ paddingTop: "96px" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            style={{
              maxWidth: "680px", margin: "0 auto",
              padding: "48px",
              background: "linear-gradient(145deg, rgba(109,86,250,0.08) 0%, rgba(6,8,16,0) 100%)",
              border: "1px solid rgba(109,86,250,0.2)",
              borderRadius: "24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(109,86,250,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

            <p style={{ fontSize: "44px", color: "var(--brand-light)", lineHeight: 0.8, marginBottom: "20px", fontFamily: "Georgia, serif", opacity: 0.5 }}>&ldquo;</p>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "32px", fontStyle: "italic", position: "relative" }}>
              I built BYUND because I couldn&apos;t find a governance tool that was both
              powerful enough for a serious IT team and simple enough for a team of five to actually use.
              Everything was either a $50,000-a-year enterprise platform or a basic spreadsheet template.
              There was nothing in between. That&apos;s the gap we&apos;re filling.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--brand-light), var(--brand-dark))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", fontWeight: 800, color: "#fff",
              }}>
                N
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>NIPPY</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Founder, NIPPYSKY LIMITED</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="container" style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
              Ready to take governance seriously?
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>
              Join the waitlist and be first when BYUND Governance launches.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/#waitlist" className="btn btn-primary btn-lg" style={{ gap: "8px" }}>
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
