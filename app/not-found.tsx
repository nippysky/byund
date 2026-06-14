"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, BookOpen, Shield } from "lucide-react";

const QUICK_LINKS = [
  { icon: <Home size={15} />,      label: "Home",             href: "/"          },
  { icon: <Shield size={15} />,    label: "BYUND Governance", href: "/governance"},
  { icon: <BookOpen size={15} />,  label: "Company",          href: "/company"   },
];

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text-1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(114,96,251,0.12) 0%, transparent 70%), " +
            "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(114,96,251,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), " +
            "linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "560px", width: "100%" }}>

        {/* 404 numeral — the hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          style={{ marginBottom: "8px", lineHeight: 1 }}
        >
          <span
            style={{
              fontSize: "clamp(120px, 28vw, 220px)",
              fontWeight: 900,
              letterSpacing: "-0.07em",
              background: "linear-gradient(135deg, var(--border-med) 0%, rgba(114,96,251,0.3) 50%, var(--border) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "block",
              userSelect: "none",
            }}
          >
            404
          </span>
        </motion.div>

        {/* BYUND mark overlay on the 4-0-4 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "7px",
              padding: "5px 14px", borderRadius: "100px",
              background: "var(--brand-sub2)", border: "1px solid rgba(114,96,251,0.25)",
              fontSize: "12px", fontWeight: 700, color: "var(--brand-hi)",
              letterSpacing: "0.05em", textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-hi)", display: "inline-block" }} />
            Page not found
          </div>

          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 800, letterSpacing: "-0.045em",
              color: "var(--text-1)", marginBottom: "14px",
            }}
          >
            This page doesn&apos;t exist yet.
          </h1>
          <p
            style={{
              fontSize: "16px", color: "var(--text-2)", lineHeight: 1.7,
              marginBottom: "44px", maxWidth: "380px", margin: "0 auto 44px",
            }}
          >
            You may have followed a broken link, or this page hasn&apos;t been built yet. Either way, let&apos;s get you somewhere useful.
          </p>

          {/* Primary CTA */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}>
            <button
              onClick={() => window.history.length > 1 && window.history.back()}
              className="btn btn-ghost btn-md"
              style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}
            >
              <ArrowLeft size={15} /> Go back
            </button>
            <Link href="/" className="btn btn-primary btn-md">
              <Home size={15} /> Back to home
            </Link>
          </div>

          {/* Quick links */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "32px",
            }}
          >
            <p style={{ fontSize: "12px", color: "var(--text-3)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "18px" }}>
              Quick navigation
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
              {QUICK_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                >
                  <Link
                    href={l.href}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "7px",
                      padding: "9px 16px", borderRadius: "10px",
                      background: "var(--surface-1)", border: "1px solid var(--border)",
                      fontSize: "13px", fontWeight: 600, color: "var(--text-2)",
                      textDecoration: "none", transition: "all 0.15s ease",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "var(--brand-sub2)";
                      el.style.borderColor = "rgba(114,96,251,0.3)";
                      el.style.color = "var(--text-1)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "var(--surface-1)";
                      el.style.borderColor = "var(--border)";
                      el.style.color = "var(--text-2)";
                    }}
                  >
                    <span style={{ color: "var(--brand-hi)" }}>{l.icon}</span>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ marginTop: "48px", fontSize: "12px", color: "var(--text-3)" }}
          >
            If you think this is a bug, email{" "}
            <a href="mailto:hello@nippysky.com" style={{ color: "var(--brand-hi)" }}>
              hello@nippysky.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
