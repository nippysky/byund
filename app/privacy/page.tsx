import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SECTIONS = [
  {
    title: "What data we collect",
    body: `We collect: (a) Account information — name, email address, and password (hashed, never stored in plaintext); (b) Usage data — how you interact with the platform, pages visited, features used; (c) Content you create — assets, reviews, findings, evidence documents, and audit logs you add to BYUND; (d) Technical data — IP addresses, browser type, device information, and timestamps for security purposes.`,
  },
  {
    title: "How we use your data",
    body: `We use your data to: provide and improve the BYUND platform; send you product updates and security notices; respond to your support requests; maintain the security and integrity of the platform; comply with legal obligations. We do not use your data for advertising or sell it to third parties — ever.`,
  },
  {
    title: "Data storage and security",
    body: `Your data is stored on secure cloud infrastructure. We use industry-standard encryption in transit (TLS 1.3+) and at rest. Access to production databases is strictly limited and logged. Evidence documents and uploads are stored in isolated, encrypted object storage with access controlled via short-lived signed URLs. We conduct regular security reviews.`,
  },
  {
    title: "Data retention",
    body: `We retain your account data for as long as your account is active. Activity logs and audit trails are retained per your plan's retention policy (30 days for Starter, 1 year for Growth, custom for Enterprise). If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it by law.`,
  },
  {
    title: "Third-party services",
    body: `We use a limited number of trusted third-party services to operate BYUND — including cloud hosting, email delivery, and analytics. These processors are contractually required to handle your data securely and only as instructed. We do not use advertising networks or tracking pixels.`,
  },
  {
    title: "Your rights",
    body: `You have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data; export your data in a portable format; object to processing in certain circumstances. To exercise any of these rights, contact us at privacy@nippysky.com.`,
  },
  {
    title: "Cookies",
    body: `We use a minimal set of cookies: session cookies required for authentication, and preference cookies to remember your theme and settings. We do not use third-party advertising cookies. You can disable cookies in your browser settings, but some platform functionality may be affected.`,
  },
  {
    title: "Children",
    body: `BYUND is not intended for individuals under the age of 16. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a minor, please contact us immediately and we will delete it.`,
  },
  {
    title: "Changes to this policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notice at least 14 days before they take effect. Your continued use of BYUND after changes take effect constitutes acceptance of the revised policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <Header />
      <div style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px" }}>
            <span className="label" style={{ display: "block", marginBottom: "16px" }}>Legal</span>
            <h1 className="display-md" style={{ marginBottom: "16px" }}>Privacy Policy</h1>
            <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7 }}>
              Last updated: June 2026. NIPPYSKY LIMITED is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights.
            </p>
          </div>

          {/* Commitment card */}
          <div style={{
            padding: "20px 24px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "14px", marginBottom: "48px",
          }}>
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text-1)" }}>Our commitment:</strong> We don&apos;t sell your data. We don&apos;t show you ads. We only collect what we need to run BYUND. Your data is yours — you can export or delete it anytime.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {SECTIONS.map(s => (
              <div key={s.title} style={{ paddingBottom: "40px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: "14px" }}>{s.title}</h2>
                <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "60px", padding: "32px", background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>Privacy questions?</h3>
            <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "8px" }}>
              Email <a href="mailto:privacy@nippysky.com" style={{ color: "var(--brand-hi)", fontWeight: 600 }}>privacy@nippysky.com</a>
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-3)" }}>NIPPYSKY LIMITED · Nigeria</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
