// components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function classNames(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={classNames(
        "fixed inset-x-0 top-0 z-40 flex justify-center transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-border"
          : "bg-white/75 backdrop-blur-sm"
      )}
    >
      <div className="flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[18px] font-semibold tracking-tight">
            BYUND
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link
            href="#how-it-works"
            className="font-medium text-foreground/85 transition-all duration-150 hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="font-medium text-foreground/85 transition-all duration-150 hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#developers"
            className="font-medium text-foreground/85 transition-all duration-150 hover:text-foreground"
          >
            Developers
          </Link>
          <Link
            href="#"
            className="font-medium text-foreground/85 transition-all duration-150 hover:text-foreground"
          >
            Docs
          </Link>

          {/* Sign in */}
          <Link
            href="/signin"
            className={classNames(
              "inline-flex items-center justify-center",
              "rounded-md bg-accent text-white text-xs font-semibold",
              "px-4 py-1.5 tracking-tight",
              "shadow-[0_2px_6px_rgba(0,102,255,0.28)]",
              "hover:shadow-[0_4px_14px_rgba(0,102,255,0.32)]",
              "hover:-translate-y-1px active:translate-y-0",
              "transition-all duration-200"
            )}
          >
            Sign in
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/signin"
            className={classNames(
              "inline-flex items-center justify-center",
              "rounded-md bg-accent text-white text-xs font-semibold",
              "px-3 py-1.5",
              "shadow-[0_2px_6px_rgba(0,102,255,0.28)]",
              "hover:shadow-[0_4px_14px_rgba(0,102,255,0.32)]",
              "hover:-translate-y-1px active:translate-y-0",
              "transition-all duration-200"
            )}
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
