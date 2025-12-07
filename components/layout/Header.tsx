"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex justify-center transition-all duration-300",
        isScrolled
          ? "bg-white/90 border-b border-border backdrop-blur-lg"
          : "bg-white/70 backdrop-blur-sm"
      )}
    >
      <div className="flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-[18px] font-semibold tracking-[-0.03em]">
            BYUND
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link
            href="/docs"
            className="font-medium text-foreground/90 tracking-[-0.01em] transition-all hover:text-foreground"
          >
            Documentation
          </Link>

          <Link
            href="/signin"
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-md bg-accent text-white text-xs font-semibold tracking-tight",
              "px-4 py-2",
              "shadow-[0_2px_6px_rgba(0,102,255,0.28)]",
              "hover:shadow-[0_4px_14px_rgba(0,102,255,0.32)]",
              "hover:-translate-y-px active:translate-y-0",
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
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-md bg-accent text-white text-xs font-semibold tracking-tight",
              "px-3 py-2",
              "shadow-[0_2px_6px_rgba(0,102,255,0.28)]",
              "hover:shadow-[0_4px_14px_rgba(0,102,255,0.32)]",
              "hover:-translate-y-px active:translate-y-0",
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
