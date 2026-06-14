"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, MessageSquare, Briefcase, Shield, CheckCircle2 } from "lucide-react";

const TOPICS = [
  { icon: <MessageSquare size={16} />, label: "General enquiry",     value: "general"   },
  { icon: <Briefcase size={16} />,    label: "Enterprise / sales",  value: "enterprise"},
  { icon: <Shield size={16} />,       label: "Security",            value: "security"  },
  { icon: <Mail size={16} />,         label: "Other",               value: "other"     },
];

const inputStyle = {
  display: "block", width: "100%", padding: "12px 16px",
  background: "var(--surface-1)", border: "1px solid var(--border-med)",
  borderRadius: "10px", fontSize: "14px", color: "var(--text-1)",
  outline: "none", fontFamily: "var(--font-public-sans), system-ui, sans-serif",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  resize: "none" as const,
} as const;

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  (e.target as HTMLElement).style.borderColor = "var(--brand)";
  (e.target as HTMLElement).style.boxShadow = "0 0 0 3px var(--brand-sub)";
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  (e.target as HTMLElement).style.borderColor = "var(--border-med)";
  (e.target as HTMLElement).style.boxShadow = "none";
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <Header />

      <section style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        <div className="container">
          <div className="grid-split" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="label" style={{ display: "block", marginBottom: "20px" }}>Get in touch</span>
              <h1 className="display-md" style={{ marginBottom: "20px" }}>
                We&apos;re a team that<br />
                <span className="text-brand">actually responds.</span>
              </h1>
              <p style={{ fontSize: "17px", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "48px", maxWidth: "400px" }}>
                Whether you&apos;re interested in BYUND Governance, want to talk enterprise, or just have a question — send us a message and we&apos;ll get back to you within one business day.
              </p>

              {/* Contact methods */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { icon: <Mail size={16} />,        label: "General",   value: "hello@nippysky.com",    href: "mailto:hello@nippysky.com"    },
                  { icon: <Shield size={16} />,      label: "Security",  value: "security@nippysky.com", href: "mailto:security@nippysky.com" },
                  { icon: <Briefcase size={16} />,   label: "Enterprise",value: "enterprise@nippysky.com",href: "mailto:enterprise@nippysky.com"},
                ].map(item => (
                  <a key={item.label} href={item.href}
                    style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}
                  >
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "10px",
                      background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--brand-hi)", flexShrink: 0,
                    }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: "3px" }}>{item.label}</p>
                      <p style={{ fontSize: "14px", color: "var(--brand-hi)", fontWeight: 500 }}>{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ marginTop: "48px", padding: "20px 24px", background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "14px" }}>
                <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.7 }}>
                  <strong style={{ color: "var(--text-1)" }}>Response time:</strong> We aim to respond to all enquiries within 1 business day. Enterprise and security reports are prioritised.
                </p>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            >
              <div style={{
                background: "var(--surface-1)", border: "1px solid var(--border-med)",
                borderRadius: "24px", padding: "40px",
              }}>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ textAlign: "center", padding: "40px 20px" }}
                  >
                    <div style={{
                      width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 24px",
                      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <CheckCircle2 size={28} color="var(--success)" />
                    </div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "12px" }}>Message sent!</h2>
                    <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.7 }}>
                      Thanks for reaching out. We&apos;ll get back to you within one business day.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "7px" }}>Your name</label>
                      <input
                        type="text" required placeholder="Full name" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "7px" }}>Email address</label>
                      <input
                        type="email" required placeholder="you@company.com" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "7px" }}>Topic</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {TOPICS.map(t => (
                          <button key={t.value} type="button" onClick={() => setForm(f => ({ ...f, topic: t.value }))}
                            style={{
                              display: "flex", alignItems: "center", gap: "6px",
                              padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                              background: form.topic === t.value ? "var(--brand-sub2)" : "var(--surface-2)",
                              border: `1px solid ${form.topic === t.value ? "rgba(114,96,251,0.35)" : "var(--border)"}`,
                              color: form.topic === t.value ? "var(--brand-hi)" : "var(--text-2)",
                              transition: "all 0.15s ease",
                            }}>
                            {t.icon} {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "7px" }}>Message</label>
                      <textarea
                        required rows={5} placeholder="Tell us what's on your mind…" value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                      {loading ? "Sending…" : "Send message"}
                    </button>
                    <p style={{ fontSize: "12px", color: "var(--text-3)", textAlign: "center" }}>
                      We typically respond within 1 business day.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
