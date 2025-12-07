// components/ui/Button.tsx
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  `
    inline-flex items-center justify-center
    font-medium text-sm tracking-[-0.01em]
    transition-all duration-200
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent
    focus-visible:ring-offset-background
    disabled:opacity-60 disabled:cursor-not-allowed
    will-change-transform
  `,
  {
    variants: {
      variant: {
        primary: `
          bg-accent text-white
          rounded-lg
          shadow-[0_2px_6px_rgba(0,102,255,0.24)]
          hover:shadow-[0_4px_14px_rgba(0,102,255,0.28)]
          hover:-translate-y-[1px]
          active:translate-y-[0px]
        `,
        secondary: `
          rounded-lg
          border border-border
          bg-white text-foreground/90
          hover:bg-surface/90 hover:text-foreground
          hover:shadow-[0_1px_6px_rgba(15,17,21,0.06)]
          hover:-translate-y-[1px]
          active:translate-y-[0px]
        `,
        ghost: `
          rounded-lg
          text-foreground/70
          hover:bg-surface/60 hover:text-foreground
          active:bg-surface
        `,
      },
      size: {
        lg: "h-11 px-5 text-[15px]",
        md: "h-10 px-5",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  children: ReactNode;
  asChild?: boolean;
}

export function Button({
  variant,
  size,
  className,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonStyles({ variant, size }), className)} {...props}>
      {children}
    </Comp>
  );
}
