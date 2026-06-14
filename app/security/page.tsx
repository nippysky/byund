import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Lock, Shield, Server, Eye, Key, AlertTriangle } from "lucide-react";

const PRACTICES = [
  {
    icon: <Lock size={20} />,
    title: "Encryption in transit & at rest",
    desc: "All data transmitted to and from BYUND is encrypted using TLS 1.3. Data at rest — including your assets, evidence documents, and audit logs — is encrypted using AES-256.",
  },
  {
    icon: <Key size={20} />,
    title: "Password security",
    desc: "Passwords are never stored in plaintext. We use bcrypt with a high work factor. We enforce minimum password complexity requirements and support session-level controls.",
  },
  {
    icon: <Shield size={20} />,
    title: "Access controls",
    desc: "Access to production systems is strictly limited to authorised personnel, protected by MFA. All access is logged and reviewed. Database access is IP-restricted and requires authentication.",
  },
  {
    icon: <Server size={20} />,
    title: "Infrastructure security",
    desc: "BYUND runs on hardened cloud infrastructure. Environments are isolated. Dependency updates are reviewed and applied regularly. We run automated vulnerability scanning on our codebase.",
  },
  {
    icon: <Eye size={20} />,
    title: "Audit trail",
    desc: "Every action in BYUND generates an immutable, timestamped audit log entry. These logs cannot be edited or deleted and include before/after states for all changes.",
  },
  {
    icon: <AlertTriangle size={20} />,
    title: "Incident response",
    desc: "We have a documented incident response plan. In the event of a data breach, we will notify affected users within 72 hours as required by applicable data protection law.",
  },
];

export default function SecurityPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <Header />
      <div style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container">
          {/* Hero */}
          <div style={{ maxWidth: "640px", margin: "0 auto 80px", textAlign: "center" }}>
            <span className="label" style={{ display: "block", marginBottom: "16px" }}>Security</span>
            <h1 className="display-md" style={{ marginBottom: "16px" }}>
              Security is not an{" "}
              <span className="text-brand">afterthought.</span>
            </h1>
            <p style={{ fontSize: "17px", color: "var(--text-2)", lineHeight: 1.7 }}>
              BYUND is built for IT governance teams — which means security is built into the foundation of everything we do, not bolted on afterwards.
            </p>
          </div>

          {/* Practices grid */}
          <div className="grid-features" style={{ marginBottom: "80px" }}>
            {PRACTICES.map((p, i) => (
              <div key={p.title} className="glass-card" style={{ padding: "36px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "13px",
                  background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--brand-hi)", marginBottom: "20px",
                }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "10px", color: "var(--text-1)" }}>{p.title}</h3>
                <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.75 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Responsible disclosure */}
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px", background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: "24px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              fontSize: "11px", fontWeight: 700, color: "var(--warning)",
              background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "100px", padding: "4px 12px", marginBottom: "20px",
              letterSpacing: "0.06em", textTransform: "uppercase" as const,
            }}>
              <AlertTriangle size={11} /> Responsible Disclosure
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "16px" }}>
              Found a security vulnerability?
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "24px" }}>
              We take all security reports seriously. If you have discovered a potential vulnerability in BYUND, please disclose it responsibly. Do not publish the vulnerability publicly before we have had a chance to address it.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {[
                "Email your findings to security@nippysky.com",
                "Include a clear description and steps to reproduce",
                "We will acknowledge receipt within 48 hours",
                "We will keep you updated as we investigate",
                "We will credit you (if desired) once resolved",
              ].map(step => (
                <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--text-2)" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-hi)", flexShrink: 0, marginTop: "7px" }} />
                  {step}
                </div>
              ))}
            </div>
            <Link href="mailto:security@nippysky.com" className="btn btn-primary btn-md">
              Report a Vulnerability
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
