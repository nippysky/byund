"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitted) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="section" style={{ position: "relative", overflow: "hidden" }}>
      {/* Background glow */}
      <div className="glow-blob" style={{ width: "600px", height: "600px", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.8 }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{
            textAlign: "center",
            maxWidth: "640px",
            margin: "0 auto",
          }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "11px", fontWeight: 700, color: "var(--brand-light)",
            background: "rgba(109,86,250,0.1)", border: "1px solid rgba(109,86,250,0.25)",
            borderRadius: "100px", padding: "5px 14px", marginBottom: "28px",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-light)", display: "inline-block" }} className="animate-pulse-dot" />
            Join the Waitlist
          </div>

          <h2
            className="text-gradient-white"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "20px" }}
          >
            Be first when BYUND Governance launches.
          </h2>

          <p style={{ fontSize: "18px", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "44px" }}>
            Early members get priority access, reduced pricing, and direct input into the product roadmap.
            No spam. Unsubscribe anytime.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "16px", padding: "20px 32px",
                fontSize: "16px", color: "var(--success)", fontWeight: 600,
              }}
            >
              <CheckCircle2 size={20} />
              You&apos;re on the list! We&apos;ll be in touch soon.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", maxWidth: "480px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  flex: "1 1 240px",
                  padding: "14px 18px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "15px",
                  color: "var(--text-primary)",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(109,86,250,0.5)"; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ gap: "8px", flexShrink: 0 }}
              >
                {loading ? "Joining..." : <>Join Waitlist <ArrowRight size={15} /></>}
              </button>
            </form>
          )}

          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "16px" }}>
            By joining, you agree to receive product updates from NIPPYSKY LIMITED.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
