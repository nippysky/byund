import { redirect } from "next/navigation";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_ACCOUNTS_URL ?? "https://byund-accounts.vercel.app";

/**
 * /signin no longer exists on the marketing site.
 * Hard-redirect anyone who lands here (bookmarks, old links) to BYUND Accounts.
 */
export default function SignInPage() {
  redirect(ACCOUNTS_URL);
}
