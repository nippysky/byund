import Link from "next/link";

function BYUNDMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="7" fill="url(#f-grad)" />
      <path d="M8 8h5.5a4 4 0 0 1 0 8H8V8Z" fill="white" fillOpacity="0.9" />
      <path d="M8 16h6.5a4 4 0 0 1 0 8H8v-8Z" fill="white" fillOpacity="0.45" />
      <defs>
        <linearGradient id="f-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9b8bfb" />
          <stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const LINKS = {
  Products: [
    { label: "BYUND Governance", href: "/governance" },
    { label: "More coming soon", href: "#" },
  ],
  Company: [
    { label: "About", href: "/company" },
    { label: "Contact", href: "mailto:hello@nippysky.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "64px 0 40px",
        position: "relative",
      }}
    >
      <div className="container">
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
            marginBottom: "56px",
          }}
          className="md:grid-cols-[1.5fr_1fr_1fr_1fr]"
        >
          {/* Brand */}
          <div style={{ maxWidth: "280px" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <BYUNDMark />
              <span style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
                BYUND
              </span>
            </Link>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.7" }}>
              The platform behind modern IT governance. Know what you own. Know who owns it.
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px", opacity: 0.6 }}>
              A product of NIPPYSKY LIMITED
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "20px",
                }}
              >
                {section}
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "28px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} NIPPYSKY LIMITED. All rights reserved.
          </p>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "var(--text-muted)",
              opacity: 0.5,
            }}
          >
            B Y U N D
          </p>
        </div>
      </div>
    </footer>
  );
}
