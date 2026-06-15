import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { AccountNav } from "@/components/AccountNav";
import { BillingClient } from "./BillingClient";

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" rx="44" fill="url(#b-g)" />
      <defs><linearGradient id="b-g" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#b8acfe"/><stop offset="1" stopColor="#4f3dd4"/></linearGradient></defs>
      <path opacity=".93" fillRule="evenodd" clipRule="evenodd" d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z" fill="#fff" />
    </svg>
  );
}

async function getSubscription(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://byund-api.up.railway.app";
  try {
    const res = await fetch(`${apiUrl}/v1/auth/subscription`, {
      headers: { "Authorization": `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return { plan: "free", status: "active" };
    return res.json();
  } catch {
    return { plan: "free", status: "active" };
  }
}

export default async function BillingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("byund_session")?.value ?? "";
  const subscription = await getSubscription(token);

  const initials = session.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);
  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)", color: "var(--text-1)" }}>

      {/* Nav */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 60, borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50, background: "var(--bg)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <Mark />
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: "var(--brand)", lineHeight: 1 }}>BYUND</div>
            <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-3)", marginTop: 2, lineHeight: 1 }}>ACCOUNTS</div>
          </div>
        </Link>
        <AccountNav name={session.name} email={session.email} initials={initials} />
      </header>

      {/* Content */}
      <main style={{ flex: 1, maxWidth: 860, width: "100%", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
            ← Back to apps
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 6 }}>Billing & Plans</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Choose the plan that fits your team.
          </p>
        </div>

        <BillingClient
          email={session.email}
          name={session.name}
          currentPlan={subscription.plan ?? "free"}
          currentStatus={subscription.status ?? "active"}
          paystackPublicKey={paystackKey}
        />
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>© {new Date().getFullYear()} NIPPYSKY LIMITED · Payments secured by Paystack</p>
        <div style={{ display: "flex", gap: 16 }}>
          {[["https://byund.com/privacy","Privacy"],["https://byund.com/terms","Terms"]].map(([h,l]) => (
            <Link key={h} href={h} style={{ fontSize: 11, color: "var(--text-3)" }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
