import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using BYUND ("the Service"), operated by NIPPYSKY LIMITED, you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service. These terms apply to all users, including visitors, registered users, and paying customers.`,
  },
  {
    title: "2. Description of Service",
    body: `BYUND is a SaaS platform for IT governance, asset ownership tracking, review scheduling, audit findings management, and evidence documentation. Features may change as the product evolves. We will provide reasonable notice of material changes.`,
  },
  {
    title: "3. Account Registration",
    body: `You must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials. You must notify us immediately at hello@nippysky.com if you suspect unauthorised access to your account.`,
  },
  {
    title: "4. Acceptable Use",
    body: `You agree not to use BYUND to: (a) violate any applicable law or regulation; (b) upload malicious code or attempt to compromise the security of the platform; (c) impersonate any person or entity; (d) use the platform to store or process data you are not authorised to handle; or (e) attempt to reverse-engineer any aspect of the Service.`,
  },
  {
    title: "5. Data & Privacy",
    body: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms. We process your data as a data processor acting on your instructions as data controller. You retain ownership of all data you upload or create through BYUND.`,
  },
  {
    title: "6. Intellectual Property",
    body: `BYUND and all related marks, logos, and designs are the intellectual property of NIPPYSKY LIMITED. The software, documentation, and all content we produce remain our property. You retain all rights to the data and content you upload to the platform.`,
  },
  {
    title: "7. Subscription & Payment",
    body: `BYUND is currently free during early access. When paid plans launch, pricing will be communicated clearly in advance. Paid subscriptions are billed in advance on a monthly or annual basis. Refunds are handled on a case-by-case basis. You may cancel your subscription at any time; access continues until the end of the billing period.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `To the fullest extent permitted by law, NIPPYSKY LIMITED shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability to you for any claims shall not exceed the amount you paid to us in the 12 months prior to the claim.`,
  },
  {
    title: "9. Service Availability",
    body: `We aim for high availability but cannot guarantee uninterrupted access to the Service. We will provide advance notice of planned maintenance. We are not liable for service interruptions caused by circumstances outside our reasonable control.`,
  },
  {
    title: "10. Termination",
    body: `Either party may terminate the agreement with reasonable notice. We may terminate or suspend your access immediately if you violate these Terms. Upon termination, your right to use the Service ceases. We will provide a reasonable period to export your data.`,
  },
  {
    title: "11. Governing Law",
    body: `These Terms shall be governed by the laws of the Federal Republic of Nigeria. Any disputes arising under these Terms shall be resolved through the courts of Nigeria, or through binding arbitration as agreed by both parties.`,
  },
  {
    title: "12. Changes to Terms",
    body: `We may update these Terms from time to time. We will notify you of material changes via email or in-app notice. Continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" }}>
      <Header />
      <div style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="container" style={{ maxWidth: "780px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "60px" }}>
            <span className="label" style={{ display: "block", marginBottom: "16px" }}>Legal</span>
            <h1 className="display-md" style={{ marginBottom: "16px" }}>Terms of Service</h1>
            <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7 }}>
              Last updated: June 2026. These terms govern your use of the BYUND platform and services operated by NIPPYSKY LIMITED.
            </p>
          </div>

          {/* Notice card */}
          <div style={{
            padding: "20px 24px", background: "var(--brand-sub)", border: "1px solid rgba(114,96,251,0.2)",
            borderRadius: "14px", marginBottom: "48px",
          }}>
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--text-1)" }}>Summary:</strong> You own your data. We don&apos;t sell it. BYUND is free during early access. You can cancel anytime. We&apos;ll always notify you of material changes. Questions? Email <a href="mailto:hello@nippysky.com" style={{ color: "var(--brand-hi)" }}>hello@nippysky.com</a>
            </p>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {SECTIONS.map(s => (
              <div key={s.title} style={{ paddingBottom: "40px", borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)", marginBottom: "14px" }}>{s.title}</h2>
                <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ marginTop: "60px", padding: "32px", background: "var(--surface-1)", border: "1px solid var(--border-med)", borderRadius: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>Questions about these terms?</h3>
            <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "16px" }}>
              Contact us at <a href="mailto:hello@nippysky.com" style={{ color: "var(--brand-hi)", fontWeight: 600 }}>hello@nippysky.com</a> — we&apos;re happy to clarify anything.
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-3)" }}>NIPPYSKY LIMITED · Nigeria</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
