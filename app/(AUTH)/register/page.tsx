// app/register/page.tsx
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

function safeNextPath(raw: unknown) {
  if (typeof raw !== "string" || !raw) return "/dashboard";
  if (!raw.startsWith("/")) return "/dashboard";
  if (raw.startsWith("//")) return "/dashboard";
  return raw;
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const rawNext = searchParams?.next;
  const nextValue = Array.isArray(rawNext) ? rawNext[0] : rawNext;
  const nextPath = safeNextPath(nextValue);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
        {/* Top logo */}
        <header className="mb-10 flex items-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-[20px] font-semibold tracking-[-0.04em]">
              BYUND
            </span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
            {/* Left: value prop / bullets – desktop only */}
            <section className="hidden space-y-5 md:block">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
                Global USD rail
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Accept USD from anywhere, settle to your wallet.
              </h1>
              <p className="max-w-md text-sm text-muted md:text-base">
                Create a BYUND account in minutes. Connect your wallet once,
                share a payment link, and receive USD-denominated payments from
                clients and customers globally.
              </p>

              <ul className="space-y-2 text-sm text-muted">
                <li>• No banks or local accounts required.</li>
                <li>• Add business details and payout preferences after sign up.</li>
                <li>• Test in sandbox before going live with real customers.</li>
              </ul>
            </section>

            {/* Right: signup card */}
            <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-white px-6 py-7 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight">
                Create your account
              </h2>
              <p className="mt-1 text-sm text-muted">
                Use an email you check often. We&apos;ll send account updates
                and security notices there.
              </p>

              <RegisterForm nextPath={nextPath} />
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-8 flex items-center justify-between text-[11px] text-muted">
            <span>© {new Date().getFullYear()} BYUND</span>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="hover:text-foreground hover:underline"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground hover:underline"
              >
                Terms
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
