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
    <section id="waitlist" className="section" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--border)" }}>
      <div className="glow-blob" style={{ width: "700px", height: "700px", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.9 }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{ textAlign: "center", maxWidth: "660px", margin: "0 auto" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "11px", fontWeight: 700, color: "var(--brand-hi)",
            background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
            borderRadius: "100px", padding: "5px 14px", marginBottom: "28px",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-hi)", display: "inline-block" }} />
            Join the Waitlist
          </div>

          <h2
            className="text-gradient-white display-lg"
            style={{ marginBottom: "20px" }}
          >
            Be first when<br />BYUND Governance launches.
          </h2>

          <p style={{ fontSize: "18px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "48px" }}>
            Early members get priority access, reduced pricing, and direct input into the product roadmap.
            No spam. Unsubscribe anytime.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "12px",
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "16px", padding: "22px 36px",
                fontSize: "16px", color: "var(--success)", fontWeight: 600,
              }}
            >
              <CheckCircle2 size={22} />
              You&apos;re on the list! We&apos;ll be in touch soon.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", maxWidth: "500px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  flex: "1 1 240px",
                  padding: "15px 20px",
                  background: "var(--surface-1)",
                  border: "1px solid var(--border-med)",
                  borderRadius: "12px",
                  fontSize: "15px",
                  color: "var(--text-1)",
                  outline: "none",
                  fontFamily: "var(--font-public-sans), system-ui, sans-serif",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--brand)";
                  (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px var(--brand-sub)";
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--border-med)";
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ flexShrink: 0 }}
              >
                {loading ? "Joining..." : <><span>Join Waitlist</span> <ArrowRight size={15} /></>}
              </button>
            </form>
          )}

          <p style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "18px" }}>
            By joining, you agree to receive product updates from NIPPYSKY LIMITED.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
