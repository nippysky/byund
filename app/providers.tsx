"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/theme";
import { ToastProvider } from "@/components/ui/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}
