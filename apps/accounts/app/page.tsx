/**
 * Accounts home — redirect to marketing products showcase.
 *
 * Logged-in users land here after login (no ?next=).
 * Both paths go to the marketing /products page where they
 * can pick which app to open.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL ?? "https://byund.vercel.app";

export default async function AccountsHome() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(`${MARKETING_URL}/products`);
}
