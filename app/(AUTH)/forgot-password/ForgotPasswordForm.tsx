import { Button } from "@/components/ui/Button";
import Link from "next/link";
export default function ForgotPasswordForm() {
  return (
    <form className="space-y-4 mt-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          placeholder="byund@gmail.com"
          required
          className="mt-1 block w-full rounded-md border border-border bg-white px-3 py-2 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
        />
        
      </div>
      <div className="pt-2">
        <Button type="submit" className="w-full justify-center">
            Reset Password
        </Button>
    </div>
    </form>
  )
}
