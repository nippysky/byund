// app/signin/page.tsx
import Link from "next/link";
import { SignInForm } from "./SignInForm";


export default function SignInPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        {/* Logo row */}
        <header className="mb-10 flex items-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-[20px] font-semibold tracking-[-0.04em]">
              BYUND
            </span>
          </Link>
        </header>

        {/* Main auth card */}
        <main className="flex flex-1 flex-col justify-center">
          <div className="rounded-2xl border border-border bg-white px-6 py-7 shadow-sm">
            <h1 className="text-xl font-semibold tracking-tight">
              Sign in to BYUND
            </h1>
            <p className="mt-1 text-sm text-muted">
              Use the email and password you registered with. You can update
              business and payout details from your dashboard.
            </p>

            <SignInForm />
          </div>

          {/* Footer text */}
          <footer className="mt-6 flex items-center justify-between text-[11px] text-muted">
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
