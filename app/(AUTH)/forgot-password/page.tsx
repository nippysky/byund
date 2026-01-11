import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function page() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        {/* Logo row */}
        <header className="mb-10 flex items-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-[20px] font-semibold tracking-[-0.04em]">BYUND</span>
          </Link>
        </header>

        {/* Main forgot password card */}
        <main className="flex flex-1 flex-col justify-center">
          <div className="rounded-2xl border border-border bg-white px-6 py-7 shadow-sm">
            <div className="bg-gray-200 w-10 py-2.5 flex justify-center items-center pl-2 rounded-full mb-5">
                <Link href="/signin">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                        <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                    </svg>
                </Link>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
                Forgot Password?
            </h1>   
            <p className="mt-1 text-sm text-muted">Please enter your email address to reset your password.</p>

            <ForgotPasswordForm  />
          </div>

          {/* Footer text */}
          <footer className="mt-6 flex items-center justify-between text-[11px] text-muted">
            <span>© {new Date().getFullYear()} BYUND</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground hover:underline">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground hover:underline">
                Terms
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
          
  )
}
