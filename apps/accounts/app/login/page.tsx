/**
 * Login page — Server Component wrapper.
 *
 * If the user already has a valid session:
 *   → redirect immediately to `?next=` (if safe) or marketing products page.
 *
 * Otherwise render the client login form.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { safeRedirectUrl } from "@/lib/redirect";
import LoginClientPage from "./LoginClientPage";

const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL ?? "https://byund.vercel.app";

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await getSession();

  if (session) {
    const { next } = await searchParams;
    const safeNext = safeRedirectUrl(next ?? null);
    redirect(safeNext ?? `${MARKETING_URL}/products`);
  }

  return <LoginClientPage />;
}
