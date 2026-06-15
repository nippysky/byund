"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface Plan {
  id:           string;
  name:         string;
  price:        number;         // in NGN, 0 = free
  period:       string;
  paystackCode: string;        // Paystack plan code (set in Paystack dashboard)
  features:     string[];
  highlight:    boolean;
}

const PLANS: Plan[] = [
  {
    id:           "free",
    name:         "Free",
    price:        0,
    period:       "forever",
    paystackCode: "",
    highlight:    false,
    features: [
      "1 workspace",
      "Up to 5 assets",
      "Basic audit trail",
      "Community support",
    ],
  },
  {
    id:           "starter",
    name:         "Starter",
    price:        9_900,         // ₦9,900/mo
    period:       "month",
    paystackCode: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_STARTER ?? "",
    highlight:    false,
    features: [
      "1 workspace",
      "Up to 50 assets",
      "Full audit trail",
      "Evidence uploads",
      "Email support",
    ],
  },
  {
    id:           "pro",
    name:         "Pro",
    price:        29_900,        // ₦29,900/mo
    period:       "month",
    paystackCode: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_PRO ?? "",
    highlight:    true,
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
    id:           "business",
    name:         "Business",
    price:        79_900,        // ₦79,900/mo
    period:       "month",
    paystackCode: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_BUSINESS ?? "",
    highlight:    false,
    features: [
      "Unlimited workspaces",
      "Unlimited assets",
      "Full audit trail",
      "Evidence uploads",
      "Unlimited team members",
      "Dedicated support",
      "API access",
      "Custom domain",
      "White-label reports",
    ],
  },
];

interface Props {
  email:             string;
  name:              string;
  currentPlan:       string;
  currentStatus:     string;
  paystackPublicKey: string;
}

function formatNGN(amount: number) {
  if (amount === 0) return "Free";
  return `₦${(amount / 100).toLocaleString("en-NG")}`;
}

declare global {
  interface Window {
    PaystackPop: {
      setup(options: {
        key:       string;
        email:     string;
        amount:    number;
        currency:  string;
        plan:      string;
        firstname: string;
        metadata?: Record<string, unknown>;
        onClose:   () => void;
        callback:  (response: { reference: string }) => void;
      }): { openIframe(): void };
    };
  }
}

export function BillingClient({ email, name, currentPlan, currentStatus, paystackPublicKey }: Props) {
  const [paying,  setPaying]  = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Load Paystack inline JS
  useEffect(() => {
    if (document.getElementById("paystack-inline")) return;
    const s = document.createElement("script");
    s.id  = "paystack-inline";
    s.src = "https://js.paystack.co/v1/inline.js";
    document.head.appendChild(s);
  }, []);

  function subscribe(plan: Plan) {
    if (!paystackPublicKey) {
      setMessage("Payment not configured yet. Contact support@byund.com.");
      return;
    }
    if (!plan.paystackCode) {
      setMessage(`${plan.name} plan code not configured yet.`);
      return;
    }
    setPaying(plan.id);
    setMessage("");

    const handler = window.PaystackPop.setup({
      key:       paystackPublicKey,
      email,
      amount:    plan.price * 100,   // Paystack uses kobo
      currency:  "NGN",
      plan:      plan.paystackCode,
      firstname: name.split(" ")[0],
      metadata:  { plan: plan.id },
      onClose:   () => setPaying(null),
      callback:  async (response) => {
        setPaying(null);
        setMessage("Payment received — verifying subscription…");
        try {
          await fetch("/api/billing/paystack/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ reference: response.reference, plan: plan.id }),
          });
          setMessage("Subscription activated! Refresh the page to see your new plan.");
        } catch {
          setMessage("Payment confirmed but activation may take a moment. Refresh shortly.");
        }
      },
    });
    handler.openIframe();
  }

  const isCancelled = currentStatus === "cancelled" || currentStatus === "expired";

  return (
    <div>
      {/* Current plan banner */}
      {currentPlan !== "free" && (
        <div style={{
          marginBottom: 32, padding: "14px 20px", borderRadius: 12,
          background: "var(--surface-1)", border: "1px solid var(--border-med)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>
              Current plan: {PLANS.find(p => p.id === currentPlan)?.name ?? currentPlan}
            </span>
            {isCancelled && (
              <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 600, color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 99 }}>
                {currentStatus}
              </span>
            )}
            {!isCancelled && currentPlan !== "free" && (
              <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 600, color: "#22c55e", background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 99 }}>
                active
              </span>
            )}
          </div>
          <a href="mailto:support@byund.com?subject=Cancel+subscription" style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "underline" }}>
            Cancel subscription
          </a>
        </div>
      )}

      {/* Plan grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
      }}>
        {PLANS.map(plan => {
          const isCurrent = plan.id === currentPlan;
          const isHighlight = plan.highlight && !isCurrent;

          return (
            <div key={plan.id} style={{
              borderRadius: 18,
              background: isHighlight ? "linear-gradient(160deg, #7260fb11, var(--surface-1))" : "var(--surface-1)",
              border: `1.5px solid ${isHighlight ? "var(--brand)" : isCurrent ? "rgba(34,197,94,0.4)" : "var(--border-med)"}`,
              padding: "24px 20px",
              display: "flex", flexDirection: "column", gap: 0,
              position: "relative",
            }}>
              {isHighlight && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "var(--brand)", color: "#fff",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                  padding: "3px 12px", borderRadius: "0 0 8px 8px",
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", color: isHighlight ? "var(--brand-hi)" : "var(--text-1)" }}>
                  {formatNGN(plan.price)}
                  {plan.price > 0 && (
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-3)", marginLeft: 4 }}>/{plan.period}</span>
                  )}
                </div>
                {plan.price === 0 && (
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>No credit card required</div>
                )}
              </div>

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-2)" }}>
                    <Check size={14} color={isHighlight ? "#7260fb" : "#22c55e"} style={{ marginTop: 1, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div style={{
                  textAlign: "center", padding: "10px", borderRadius: 10,
                  background: "rgba(34,197,94,0.1)",
                  fontSize: 13, fontWeight: 700, color: "#22c55e",
                }}>
                  Current plan
                </div>
              ) : plan.id === "free" ? (
                <div style={{
                  textAlign: "center", padding: "10px", borderRadius: 10,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  fontSize: 13, fontWeight: 600, color: "var(--text-3)",
                }}>
                  Default
                </div>
              ) : (
                <button
                  onClick={() => subscribe(plan)}
                  disabled={paying === plan.id}
                  style={{
                    width: "100%", padding: "11px", borderRadius: 10,
                    background: isHighlight ? "var(--brand)" : "var(--surface-2)",
                    color: isHighlight ? "#fff" : "var(--text-1)",
                    border: isHighlight ? "none" : "1px solid var(--border-med)",
                    fontSize: 13, fontWeight: 700, cursor: paying === plan.id ? "not-allowed" : "pointer",
                    opacity: paying === plan.id ? 0.7 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {paying === plan.id ? "Opening…" : `Subscribe to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {message && (
        <p style={{ marginTop: 20, fontSize: 13, color: "var(--text-2)", textAlign: "center" }}>{message}</p>
      )}

      <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
        All prices are in Nigerian Naira (NGN) · Subscriptions renew monthly · Cancel anytime
      </p>
    </div>
  );
}
