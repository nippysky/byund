"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Zap, Globe, Users, Heart } from "lucide-react";

const VALUES = [
  { icon: <Zap size={18} />,   title: "Move fast, build right",   desc: "We ship quickly but never cut corners on architecture. Speed and quality are not opposites." },
  { icon: <Globe size={18} />, title: "Africa-first, global-ready", desc: "We're building from Nigeria for the world. Our best features will make sense in Lagos and London equally." },
  { icon: <Users size={18} />, title: "Customer obsession",         desc: "We talk to users constantly. Every feature starts with a real pain, not a cool idea." },
  { icon: <Heart size={18} />, title: "Radical ownership",          desc: "Everyone here owns their outcomes. We don't micromanage — we trust and expect results." },
];

export default function CareersPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <Header />

      {/* Hero */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
        <div className="glow-blob" style={{ width: "500px", height: "500px", top: "-100px", left: "50%", transform: "translateX(-50%)", opacity: 0.65 }} />
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="label" style={{ display: "block", marginBottom: "20px" }}>Careers at BYUND</span>
            <h1 className="display-lg" style={{ marginBottom: "20px" }}>
              Help us build the future of{" "}
              <span className="text-brand">IT governance.</span>
            </h1>
            <p style={{ fontSize: "18px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "36px" }}>
              We&apos;re a small, focused team building something the market genuinely needs. If you want outsized impact and a chance to shape a product from the ground up — this is for you.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get in touch <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Current status */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
            >
              <div style={{
                padding: "32px 36px",
                background: "var(--brand-sub)",
                border: "1px solid rgba(114,96,251,0.2)",
                borderRadius: "20px", marginBottom: "48px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--warning)" }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--warning)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                    No open roles right now
                  </span>
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "12px" }}>
                  We&apos;re in early-stage build mode.
                </h2>
                <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.75 }}>
                  BYUND is pre-launch and we&apos;re a tiny, focused team right now. We don&apos;t have open positions today, but that will change as we grow. If you believe in what we&apos;re building and want to be considered when we do hire — we&apos;d love to hear from you.
                </p>
              </div>

              <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "20px" }}>
                Who we&apos;ll be looking for
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "48px" }}>
                {[
                  { role: "Full-Stack Engineers",        note: "NestJS, Next.js, PostgreSQL, TypeScript" },
                  { role: "Product Designers",           note: "B2B SaaS, design systems, user research"  },
                  { role: "DevOps / Infrastructure",     note: "Docker, Kubernetes, cloud architecture"   },
                  { role: "Sales / Growth",              note: "B2B SaaS, IT or fintech space preferred"  },
                  { role: "Customer Success",            note: "Technical background, strong communication"},
                ].map(item => (
                  <div key={item.role} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 20px", background: "var(--surface-1)",
                    border: "1px solid var(--border)", borderRadius: "12px",
                    flexWrap: "wrap", gap: "8px",
                  }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-1)" }}>{item.role}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-3)", fontWeight: 500 }}>{item.note}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            style={{ maxWidth: "480px", marginBottom: "56px" }}
          >
            <span className="label" style={{ display: "block", marginBottom: "16px" }}>How we work</span>
            <h2 className="display-sm">What it&apos;s like at BYUND</h2>
          </motion.div>

          <div className="grid-2">
            {VALUES.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card" style={{ padding: "36px" }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-hi)", marginBottom: "18px",
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "8px", color: "var(--text-1)" }}>{v.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.75 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <h2 className="display-sm" style={{ marginBottom: "14px" }}>Interested in the future?</h2>
            <p style={{ fontSize: "16px", color: "var(--text-2)", marginBottom: "28px" }}>
              Send us a note. Tell us who you are and what you build. We read every email.
            </p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Say hello <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
