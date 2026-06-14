import Link from "next/link";

function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#f-g2)" />
      <path d="M9 9h6.5a4.5 4.5 0 0 1 0 9H9V9Z" fill="white" fillOpacity="0.9" />
      <path d="M9 18h7.5a4.5 4.5 0 0 1 0 9H9v-9Z" fill="white" fillOpacity="0.42" />
      <defs>
        <linearGradient id="f-g2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a496fd" />
          <stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const COLS = [
  {
    heading: "Products",
    links: [
      { label: "BYUND Governance", href: "/governance" },
      { label: "More coming soon", href: "/#waitlist" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Contact", href: "mailto:hello@nippysky.com" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", paddingTop: "72px", paddingBottom: "44px" }}>
      <div className="container">
        {/* Grid */}
        <div className="grid-footer">
          {/* Brand col */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginBottom: "18px" }}>
              <Mark />
              <span style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.045em", color: "var(--text-1)" }}>BYUND</span>
            </Link>
            <p style={{ fontSize: "14px", color: "var(--text-3)", lineHeight: 1.75, maxWidth: "240px", marginBottom: "16px" }}>
              The platform behind modern IT governance. Know what you own. Know who owns it.
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-3)", opacity: 0.65, fontWeight: 600, letterSpacing: "0.03em" }}>
              A product of NIPPYSKY LIMITED
            </p>

            {/* SSO note */}
            <div style={{
              marginTop: "24px",
              padding: "14px 16px",
              background: "var(--brand-sub)",
              border: "1px solid rgba(114,96,251,0.2)",
              borderRadius: "12px",
              maxWidth: "260px",
            }}>
              <p style={{ fontSize: "12px", color: "var(--brand-hi)", fontWeight: 600, marginBottom: "4px" }}>
                One account. All products.
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-3)", lineHeight: 1.6 }}>
                Sign in once to access every BYUND product — like Google, but for IT governance.
              </p>
            </div>
          </div>

          {/* Link cols */}
          {COLS.map(col => (
            <div key={col.heading}>
              <p className="label" style={{ marginBottom: "20px" }}>{col.heading}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      style={{
                        fontSize: "14px",
                        color: "var(--text-2)",
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--text-1)"; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--text-2)"; }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* Bottom bar */}
        <div style={{ paddingTop: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-3)" }}>
            © {new Date().getFullYear()} NIPPYSKY LIMITED. All rights reserved.
          </p>
          <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.32em", color: "var(--text-3)", opacity: 0.45 }}>
            B Y U N D
          </p>
        </div>
      </div>
    </footer>
  );
}
