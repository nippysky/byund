"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? "https://byund-accounts.vercel.app";
import { ChevronDown, Menu, X, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
    icon: <ShieldCheck size={18} />,
    name: "BYUND Governance",
    sub: "Asset ownership, reviews & audit",
    href: "/governance",
    status: "Available Soon",
    live: true,
  },
  {
    icon: <Sparkles size={18} />,
    name: "More products",
    sub: "Join waitlist to shape what's next",
    href: "/#waitlist",
    status: "Coming Soon",
    live: false,
  },
];

function ProductsDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
      <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px 4px" }}>
        Products
      </p>
      {PRODUCTS.map(p => (
        <Link key={p.name} href={p.href} className="dropdown-item" onClick={onClose}>
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
                fontSize: "10px", fontWeight: 700,
                padding: "2px 9px", borderRadius: "100px",
                whiteSpace: "nowrap" as const,
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
        </Link>
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          height: "60px",
          background: scrolled ? "var(--header-bg-s)" : "var(--header-bg)",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
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

          {/* Center nav — desktop only */}
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
            <Link href="/#pricing" className="btn btn-ghost-nav">Pricing</Link>
          </nav>

          {/* Right — desktop only */}
          <div style={{ display: "none", alignItems: "center", gap: "10px" }} className="hdr-right">
            <ThemeToggle />
            <Link href={ACCOUNTS_URL} className="btn btn-ghost btn-sm">Sign in</Link>
            <Link href="/#waitlist" className="btn btn-primary btn-sm">Get Early Access</Link>
          </div>

          {/* Mobile: hamburger only */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hdr-mobile">
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

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div style={{ marginBottom: "8px" }}>
            <p className="label" style={{ padding: "12px 8px 8px", marginBottom: "4px" }}>Products</p>
            {PRODUCTS.map(p => (
              <Link key={p.name} href={p.href} onClick={() => setMobileOpen(false)}
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
              </Link>
            ))}
          </div>

          <div style={{ marginBottom: "8px" }}>
            <p className="label" style={{ padding: "12px 8px 8px" }}>Navigate</p>
            {[
              { label: "Company", href: "/company" },
              { label: "Pricing", href: "/#pricing" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ].map(l => (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "14px 8px", borderBottom: "1px solid var(--border)", fontSize: "15px", fontWeight: 500, color: "var(--text-2)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Theme toggle in mobile menu */}
          <div style={{ padding: "16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-2)" }}>Appearance</span>
            <ThemeToggle />
          </div>

          <div style={{ marginTop: "auto", paddingTop: "32px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href={ACCOUNTS_URL} className="btn btn-ghost btn-lg" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Sign in</Link>
            <Link href="/#waitlist" className="btn btn-primary btn-lg" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center" }}>Get Early Access</Link>
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-3)", marginTop: "24px" }}>
            One BYUND account works across all products.
          </p>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hdr-nav   { display: flex !important; }
          .hdr-right { display: flex !important; }
          .hdr-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
