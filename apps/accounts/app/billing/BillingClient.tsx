"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

interface Plan {
  id:           string;
  name:         string;
  priceNGN:     number;   // full Naira amount (e.g. 15000)
  paystackPlanCode: string;
  tagline:      string;
  features:     string[];
  highlight:    boolean;
  cta:          "current" | "free" | "subscribe" | "contact";
}

const PLANS: Plan[] = [
  {
    id:               "free",
    name:             "Free",
    priceNGN:         0,
    paystackPlanCode: "",
    tagline:          "Get started at no cost",
    highlight:        false,
    cta:              "free",
    features: [
      "1 workspace",
      "Up to 5 assets",
      "Basic audit trail",
      "Community support",
    ],
  },
  {
    id:               "pro",
    name:             "Pro",
    priceNGN:         15_000,
    paystackPlanCode: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO ?? "",
    tagline:          "For serious teams",
    highlight:        true,
    cta:              "subscribe",
    features: [
      "3 workspaces",
      "Unlimited assets",
      "Full audit trail",
      "Evidence uploads",
      "Team members (up to 10)",
      "Priority support",
      "API access",
    ],
  },
  {
    id:               "enterprise",
    name:             "Enterprise",
    priceNGN:         -1,   // custom pricing
    paystackPlanCode: "",
    tagline:          "For large organisations",
    highlight:        false,
    cta:              "contact",
    features: [
      "Unlimited workspaces",
      "Unlimited assets & members",
      "Full audit trail",
      "Dedicated account manager",
      "Custom domain",
      "White-label reports",
      "SLA guarantee",
    ],
  },
];

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PaystackPop: any;
  }
}

interface Props {
  email:             string;
  name:              string;
  currentPlan:       string;
  currentStatus:     string;
  paystackPublicKey: string;
}

function formatNGN(amount: number) {
  if (amount === 0)  return "Free";
  if (amount === -1) return "Custom";
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function BillingClient({ email, name, currentPlan, paystackPublicKey }: Props) {
  const [paying,  setPaying]  = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const scriptReady = useRef(false);

  // Load Paystack inline JS once
  useEffect(() => {
    if (document.getElementById("paystack-inline")) {
      scriptReady.current = true;
      return;
    }
    const s = document.createElement("script");
    s.id  = "paystack-inline";
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => { scriptReady.current = true; };
    document.head.appendChild(s);
  }, []);

  function waitForPaystack(): Promise<void> {
    return new Promise(resolve => {
      if (scriptReady.current && window.PaystackPop) { resolve(); return; }
      const check = setInterval(() => {
        if (window.PaystackPop) { clearInterval(check); scriptReady.current = true; resolve(); }
      }, 100);
      setTimeout(() => { clearInterval(check); resolve(); }, 5000);
    });
  }

  async function subscribe(plan: Plan) {
    if (plan.cta === "contact") {
      window.location.href = "mailto:hello@byund.com?subject=Enterprise+plan+enquiry";
      return;
    }
    if (!paystackPublicKey) {
      setMessage("Payment not configured yet. Contact support@byund.com.");
      return;
    }
    if (!plan.paystackPlanCode) {
      setMessage("This plan is not yet available. Check back soon.");
      return;
    }

    setPaying(plan.id);
    setMessage("");

    await waitForPaystack();

    if (!window.PaystackPop) {
      setPaying(null);
      setMessage("Payment script failed to load. Check your connection and try again.");
      return;
    }

    // Safety net: reset if Paystack never fires onClose (popup blocked, bad plan code, etc.)
    const safetyTimer = setTimeout(() => {
      setPaying(null);
      setMessage("Payment popup timed out — check your browser's popup blocker and try again.");
    }, 20_000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let handler: any;
    try {
      handler = window.PaystackPop.setup({
        key:       paystackPublicKey,
        email,
        // Paystack expects amount in kobo (1 NGN = 100 kobo)
        amount:    plan.priceNGN * 100,
        currency:  "NGN",
        plan:      plan.paystackPlanCode,
        firstname: name.split(" ")[0],
        lastname:  name.split(" ").slice(1).join(" "),
        metadata:  { plan: plan.id },
        onClose: () => {
          clearTimeout(safetyTimer);
          setPaying(null);
        },
        callback: async (response: { reference: string }) => {
          clearTimeout(safetyTimer);
          setPaying(null);
          setMessage("Verifying payment…");
          try {
            const res = await fetch("/api/billing/paystack/verify", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ reference: response.reference, plan: plan.id }),
            });
            if (res.ok) {
              setMessage("Subscription activated! Refreshing…");
              setTimeout(() => window.location.reload(), 1500);
            } else {
              setMessage("Payment received but activation delayed — refresh in a moment.");
            }
          } catch {
            setMessage("Payment received. Refresh to see your updated plan.");
          }
        },
      });
    } catch (setupErr) {
      clearTimeout(safetyTimer);
      setPaying(null);
      setMessage("Failed to initialise payment. Try again or contact support@byund.com.");
      console.error("[billing] PaystackPop.setup error:", setupErr);
      return;
    }

    try {
      handler.openIframe();
    } catch (openErr) {
      clearTimeout(safetyTimer);
      setPaying(null);
      setMessage("Failed to open payment popup — disable popup blockers and try again.");
      console.error("[billing] openIframe error:", openErr);
    }
  }

  return (
    <div>
      {/* Plan cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
        alignItems: "start",
      }}>
        {PLANS.map(plan => {
          const isCurrent  = plan.id === currentPlan;
          const isHighlight = plan.highlight && !isCurrent;

          return (
            <div key={plan.id} style={{
              position: "relative",
              borderRadius: 20,
              background: isHighlight
                ? "linear-gradient(160deg, rgba(114,96,251,0.06), var(--surface-1))"
                : "var(--surface-1)",
              border: `1.5px solid ${isHighlight ? "var(--brand)" : isCurrent ? "rgba(34,197,94,0.4)" : "var(--border-med)"}`,
              padding: "28px 24px",
              display: "flex", flexDirection: "column",
            }}>
              {isHighlight && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "var(--brand)", color: "#fff",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                  padding: "3px 14px", borderRadius: "0 0 10px 10px",
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 }}>
                  {plan.name}
                </div>
                <div style={{
                  fontSize: plan.priceNGN === -1 ? 28 : 34,
                  fontWeight: 800, letterSpacing: "-0.04em",
                  color: isHighlight ? "var(--brand-hi)" : "var(--text-1)",
                  marginBottom: 4,
                }}>
                  {formatNGN(plan.priceNGN)}
                  {plan.priceNGN > 0 && (
                    <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-3)", marginLeft: 4 }}>/mo</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-3)" }}>{plan.tagline}</div>
              </div>

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, color: "var(--text-2)" }}>
                    <Check size={14} color={isHighlight ? "#7260fb" : "#22c55e"} style={{ marginTop: 1, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div style={{ textAlign: "center", padding: "11px", borderRadius: 12, background: "rgba(34,197,94,0.1)", fontSize: 13, fontWeight: 700, color: "#22c55e" }}>
                  Current plan
                </div>
              ) : plan.cta === "free" ? (
                <div style={{ textAlign: "center", padding: "11px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 13, fontWeight: 600, color: "var(--text-3)" }}>
                  Always free
                </div>
              ) : plan.cta === "contact" ? (
                <button
                  onClick={() => subscribe(plan)}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 12,
                    background: "var(--surface-2)", border: "1px solid var(--border-med)",
                    color: "var(--text-1)", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Contact sales →
                </button>
              ) : (
                <button
                  onClick={() => subscribe(plan)}
                  disabled={!!paying}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 12,
                    background: isHighlight ? "var(--brand)" : "var(--surface-2)",
                    color: isHighlight ? "#fff" : "var(--text-1)",
                    border: isHighlight ? "none" : "1px solid var(--border-med)",
                    fontSize: 13, fontWeight: 700,
                    cursor: paying ? "not-allowed" : "pointer",
                    opacity: paying && paying !== plan.id ? 0.5 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {paying === plan.id ? "Opening…" : `Get ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {message && (
        <p style={{ marginTop: 24, fontSize: 13, color: "var(--text-2)", textAlign: "center" }}>{message}</p>
      )}

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
        Prices in NGN · Subscriptions renew monthly · Cancel anytime via email
      </p>
    </div>
  );
}
