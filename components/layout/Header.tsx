"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

function BYUNDMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="7" fill="url(#byund-g)" />
      <path d="M8 8h5.5a4 4 0 0 1 0 8H8V8Z" fill="white" fillOpacity="0.95" />
      <path d="M8 16h6.5a4 4 0 0 1 0 8H8v-8Z" fill="white" fillOpacity="0.5" />
      <defs>
        <linearGradient id="byund-g" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9b8bfb" />
          <stop offset="1" stopColor="#4f3dd4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const NAV = [
  { label: "Governance", href: "/governance" },
  { label: "Company", href: "/company" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6,8,16,0.88)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "60px",
          width: "100%",
          maxWidth: "1160px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BYUNDMark />
          <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>
            BYUND
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                padding: "6px 14px",
                borderRadius: "var(--radius-md)",
                transition: "all 0.15s ease",
                letterSpacing: "-0.01em",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="hidden md:flex">
          <Link href="/signin" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link href="/#waitlist" className="btn btn-primary btn-sm">Join Waitlist</Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          style={{ color: "var(--text-secondary)", padding: "8px", display: "flex" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="absolute inset-x-0 top-[60px] md:hidden"
          style={{
            background: "rgba(6,8,16,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            padding: "16px 24px 28px",
          }}
        >
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link href="/#waitlist" className="btn btn-primary btn-lg" onClick={() => setOpen(false)} style={{ justifyContent: "center" }}>
              Join the Waitlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
