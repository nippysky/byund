"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X, ShieldCheck, Sparkles, ExternalLink, LogOut, Settings, CreditCard } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const ACCOUNTS_URL   = process.env.NEXT_PUBLIC_ACCOUNTS_URL   ?? "https://byund-accounts.vercel.app";
const GOVERNANCE_URL = process.env.NEXT_PUBLIC_GOVERNANCE_URL ?? "https://byund-governance.vercel.app";
const MARKETING_URL  = process.env.NEXT_PUBLIC_MARKETING_URL  ?? "https://byund.vercel.app";

interface AuthUser { name: string; email: string; }

/* ── Helpers ── */
function ssoHref(dest: string) {
  return `${ACCOUNTS_URL}/login?next=${encodeURIComponent(dest)}`;
}
function initials(name: string) {
  return name.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2) || "B";
}

/* ── Brand mark ── */
function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#m-g)" />
      <path d="M9 9h6.5a4.5 4.5 0 0 1 0 9H9V9Z" fill="white" fillOpacity="0.95" />
      <path d="M9 18h7.5a4.5 4.5 0 0 1 0 9H9v-9Z" fill="white" fillOpacity="0.45" />
      <defs>
        <linearGradient id="m-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a496fd" />
          <stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Products dropdown ── */
const PRODUCTS = [
  {
    icon:   <ShieldCheck size={18} />,
    name:   "BYUND Governance",
    sub:    "Asset ownership, reviews & audit",
    href:   ssoHref(GOVERNANCE_URL),
    status: "Live Now",
    live:   true,
  },
  {
    icon:   <Sparkles size={18} />,
    name:   "More products",
    sub:    "Join waitlist to shape what's next",
    href:   "/#waitlist",
    status: "Coming Soon",
    live:   false,
  },
];

function ProductsDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
      <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px 4px" }}>
        Products
      </p>
      {PRODUCTS.map(p => (
        <a key={p.name} href={p.href} className="dropdown-item" onClick={onClose}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "11px", flexShrink: 0,
            background: p.live ? "var(--brand-sub2)" : "var(--surface-2)",
            border: `1px solid ${p.live ? "rgba(114,96,251,0.25)" : "var(--border)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: p.live ? "var(--brand-hi)" : "var(--text-3)",
          }}>
            {p.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>{p.name}</span>
              <span style={{
                fontSize: "10px", fontWeight: 700, padding: "2px 9px", borderRadius: "100px", whiteSpace: "nowrap" as const,
                background: p.live ? "var(--brand-sub2)" : "var(--surface-2)",
                color: p.live ? "var(--brand-hi)" : "var(--text-3)",
                border: `1px solid ${p.live ? "rgba(114,96,251,0.3)" : "var(--border-med)"}`,
              }}>
                {p.status}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-3)", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>{p.sub}</p>
          </div>
          {p.live && <ExternalLink size={13} color="var(--text-3)" style={{ flexShrink: 0, marginTop: "4px" }} />}
        </a>
      ))}
      <div style={{ margin: "8px 0 4px", height: "1px", background: "var(--border)" }} />
      <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "12px", color: "var(--text-3)" }}>One account for all BYUND products.</p>
        <Link href="/products" onClick={onClose} style={{ fontSize: "12px", color: "var(--brand-hi)", fontWeight: 700, whiteSpace: "nowrap" }}>
          See all →
        </Link>
      </div>
    </div>
  );
}

/* ── Logged-in user avatar + dropdown ── */
function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);
  const ini             = initials(user.name);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/sso/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/";
  };

  const menuItems = [
    { icon: <Settings size={14} />,   label: "Settings",        href: `${ACCOUNTS_URL}/settings` },
    { icon: <CreditCard size={14} />, label: "Billing & Plans", href: `${ACCOUNTS_URL}/billing` },
  ];

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        title={user.name}
        style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #b8acfe 0%, #4f3dd4 100%)",
          border: "2px solid rgba(114,96,251,0.4)",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#fff",
          fontSize: 12, fontWeight: 800, letterSpacing: "0.02em",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: open ? "0 0 0 3px rgba(114,96,251,0.25)" : "none",
        }}
      >
        {ini}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          background: "var(--surface-1)", border: "1px solid var(--border-med)",
          borderRadius: 16, padding: "8px", minWidth: 228,
          boxShadow: "0 12px 48px rgba(0,0,0,0.32), 0 2px 8px rgba(0,0,0,0.12)",
          zIndex: 200,
        }}>
          {/* Identity */}
          <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid var(--border)", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #b8acfe, #4f3dd4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 11, fontWeight: 800,
              }}>
                {ini}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {menuItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 10,
                  fontSize: 13, color: "var(--text-2)", textDecoration: "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ color: "var(--text-3)" }}>{item.icon}</span>
                {item.label}
              </a>
            ))}

            <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

            <button
              onClick={handleSignOut}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 12px", borderRadius: 10,
                fontSize: 13, color: "#ef4444", background: "none",
                border: "none", cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.07)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Header ── */
export default function Header() {
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [productsOpen,  setProductsOpen]  = useState(false);
  const [user,          setUser]          = useState<AuthUser | null>(null);
  const [authChecked,   setAuthChecked]   = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close products dropdown on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Check auth state — call /api/auth/me to read the SSO cookie */
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => { setUser(data); setAuthChecked(true); })
      .catch(() => setAuthChecked(true));
  }, []);

  /* Pricing CTA — goes to billing (SSO if not logged in) */
  const billingHref = user
    ? `${ACCOUNTS_URL}/billing`
    : ssoHref(`${ACCOUNTS_URL}/billing`);

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "center", height: "60px",
        background: scrolled ? "var(--header-bg-s)" : "var(--header-bg)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        <div style={{
          width: "100%", maxWidth: "1280px", padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: "100%", gap: "16px",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none", flexShrink: 0 }}>
            <Mark size={28} />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.045em", color: "var(--text-1)" }}>BYUND</span>
          </Link>

          {/* Center nav — desktop */}
          <nav style={{ display: "none", alignItems: "center", gap: "2px" }} className="hdr-nav">
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                className="btn btn-ghost-nav"
                style={{ display: "flex", alignItems: "center", gap: "5px", background: productsOpen ? "var(--surface-1)" : "transparent" }}
                onClick={() => setProductsOpen(p => !p)}
              >
                Products
                <ChevronDown size={13} style={{ transition: "transform 0.2s ease", transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {productsOpen && <ProductsDropdown onClose={() => setProductsOpen(false)} />}
            </div>
            <Link href="/company" className="btn btn-ghost-nav">Company</Link>
            {/* Pricing → billing page (SSO if not authed) */}
            <a href={billingHref} className="btn btn-ghost-nav">Pricing</a>
          </nav>

          {/* Right — desktop */}
          <div style={{ display: "none", alignItems: "center", gap: "10px" }} className="hdr-right">
            <ThemeToggle />
            {/* Show avatar if authed, Sign in if not (once auth is checked) */}
            {authChecked && user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href={ACCOUNTS_URL} className="btn btn-ghost btn-sm">Sign in</Link>
                <Link href="/#waitlist" className="btn btn-primary btn-sm">Get Early Access</Link>
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hdr-mobile">
            {/* Tiny avatar on mobile when authed */}
            {authChecked && user && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, #b8acfe, #4f3dd4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 10, fontWeight: 800,
              }}>
                {initials(user.name)}
              </div>
            )}
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{
                width: "36px", height: "36px", borderRadius: "10px",
                border: "1px solid var(--border-med)", background: "var(--surface-1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-2)", cursor: "pointer",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div style={{ marginBottom: "8px" }}>
            <p className="label" style={{ padding: "12px 8px 8px", marginBottom: "4px" }}>Products</p>
            {PRODUCTS.map(p => (
              <a key={p.name} href={p.href} onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 8px", borderBottom: "1px solid var(--border)", textDecoration: "none" }}
              >
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  background: p.live ? "var(--brand-sub2)" : "var(--surface-2)",
                  border: `1px solid ${p.live ? "rgba(114,96,251,0.25)" : "var(--border)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: p.live ? "var(--brand-hi)" : "var(--text-3)",
                }}>
                  {p.icon}
                </div>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-1)" }}>{p.name}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-3)" }}>{p.sub}</p>
                </div>
              </a>
            ))}
          </div>

          <div style={{ marginBottom: "8px" }}>
            <p className="label" style={{ padding: "12px 8px 8px" }}>Navigate</p>
            {[
              { label: "Company",  href: "/company" },
              { label: "Pricing",  href: billingHref },
              { label: "Careers",  href: "/careers" },
              { label: "Contact",  href: "/contact" },
            ].map(l => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "14px 8px", borderBottom: "1px solid var(--border)", fontSize: "15px", fontWeight: 500, color: "var(--text-2)", textDecoration: "none" }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div style={{ padding: "16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-2)" }}>Appearance</span>
            <ThemeToggle />
          </div>

          <div style={{ marginTop: "auto", paddingTop: "32px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {user ? (
              <>
                {/* Authed mobile links */}
                <div style={{ padding: "12px 8px", background: "var(--surface-1)", borderRadius: 12, border: "1px solid var(--border-med)", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{user.email}</div>
                </div>
                <a href={`${ACCOUNTS_URL}/settings`} className="btn btn-ghost btn-lg" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Settings</a>
                <a href={`${ACCOUNTS_URL}/billing`} className="btn btn-ghost btn-lg" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Billing & Plans</a>
                <button
                  onClick={async () => {
                    await fetch("/api/sso/logout", { method: "POST" }).catch(() => {});
                    window.location.href = "/";
                  }}
                  className="btn btn-ghost btn-lg"
                  style={{ justifyContent: "center", color: "#ef4444", fontFamily: "inherit" }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href={ACCOUNTS_URL} className="btn btn-ghost btn-lg" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Sign in</Link>
                <Link href="/#waitlist" className="btn btn-primary btn-lg" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Get Early Access</Link>
              </>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-3)", marginTop: "24px" }}>
            One BYUND account works across all products.
          </p>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hdr-nav    { display: flex !important; }
          .hdr-right  { display: flex !important; }
          .hdr-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
