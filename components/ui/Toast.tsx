// components/ui/Toast.tsx
"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type ToastVariant = "default" | "success" | "warning" | "error";

export type ToastItem = {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number; // default 3200
};

type ToastContextValue = {
  toast: (item: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
  // stable enough for UI; no crypto needed
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function variantClasses(v: ToastVariant) {
  switch (v) {
    case "success":
      return "border-emerald-200 bg-white";
    case "warning":
      return "border-amber-200 bg-white";
    case "error":
      return "border-rose-200 bg-white";
    default:
      return "border-border bg-white";
  }
}

function dotClasses(v: ToastVariant) {
  switch (v) {
    case "success":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    case "error":
      return "bg-rose-500";
    default:
      return "bg-accent";
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const remove = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) window.clearTimeout(t);
    timers.current.delete(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = uid();
      const next: ToastItem = {
        id,
        variant: item.variant ?? "default",
        durationMs: item.durationMs ?? 3200,
        title: item.title,
        message: item.message,
      };

      setItems((prev) => {
        // keep max 3 toasts on screen
        const limited = prev.slice(-2);
        return [...limited, next];
      });

      const timeout = window.setTimeout(() => remove(id), next.durationMs);
      timers.current.set(id, timeout);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast viewport */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-end px-4 md:bottom-6 md:px-6 lg:px-8">
        <div className="flex w-full max-w-sm flex-col gap-2">
          {items.map((t) => (
            <div
              key={t.id}
              className={
                "pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg shadow-black/5 " +
                variantClasses(t.variant ?? "default")
              }
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <span
                  className={
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full " +
                    dotClasses(t.variant ?? "default")
                  }
                />
                <div className="min-w-0 flex-1">
                  {t.title ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                      {t.title}
                    </p>
                  ) : null}
                  <p className={"mt-0.5 text-sm text-foreground"}>{t.message}</p>
                </div>

                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="rounded-lg p-1 text-muted hover:text-foreground"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>");
  }
  return ctx;
}
