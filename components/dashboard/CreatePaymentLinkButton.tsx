"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const paymentLinkSchema = z
  .object({
    name: z.string().min(1, "Enter a name for this link.").max(120, "Name is too long."),
    mode: z.enum(["fixed", "variable"]),
    amount: z.string().optional(),
    description: z.string().max(280, "Description is too long.").optional(),
  })
  .superRefine((values, ctx) => {
    if (values.mode !== "fixed") return;

    const raw = (values.amount ?? "").trim();

    // allow typing states but reject on submit
    if (!raw || raw === "0." || raw === ".") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Enter an amount for this link.",
      });
      return;
    }

    const amountNumber = Number(raw);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Amount must be a number greater than 0.",
      });
    }
  });

export type NewPaymentLinkValues = z.infer<typeof paymentLinkSchema>;

type CreatedLink = {
  id: string;
  publicId: string;
  name: string;
  mode: "FIXED" | "VARIABLE";
  fixedAmountCents: number | null;
  isActive: boolean;
  description: string | null;
  createdAt: string; // ISO
};

type CreatePaymentLinkButtonProps = {
  size?: "sm" | "md";
  onCreated?: (created: CreatedLink) => void;
};

export function CreatePaymentLinkButton({ size = "sm", onCreated }: CreatePaymentLinkButtonProps) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPaymentLinkValues>({
    resolver: zodResolver(paymentLinkSchema),
    defaultValues: {
      name: "",
      mode: "fixed",
      amount: "",
      description: "",
    },
  });


  const mode = watch("mode") || "fixed";

  const amountValue = watch("amount") ?? "";

  const baseInput =
    "block w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-0 transition-colors";
  const normalInput = baseInput + " border-border focus:border-accent focus:ring-1 focus:ring-accent";
  const errorInput =
    baseInput + " border-[#ef4444] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]";

  function handleOpen() {
    setOpen(true);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(true);
    }
  }

  function handleClose() {
    if (isSubmitting) return; // avoid closing mid-request
    setVisible(false);
    if (typeof window !== "undefined") {
      window.setTimeout(() => setOpen(false), 180);
    } else {
      setOpen(false);
    }
  }

  // money input behavior: digits + one dot + max 2 decimals, allow "0." while typing
  function handleAmountChange(raw: string) {
    let cleaned = raw.replace(/[^\d.]/g, "");

    const firstDotIndex = cleaned.indexOf(".");
    if (firstDotIndex !== -1) {
      const before = cleaned.slice(0, firstDotIndex + 1);
      const after = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
      cleaned = before + after;
    }

    if (cleaned === ".") {
      setValue("amount", "0.", { shouldDirty: true, shouldValidate: false });
      return;
    }

    const [rawInt = "", rawDec] = cleaned.split(".");

    let intPart = rawInt.replace(/^0+(?=\d)/, "");
    if (intPart === "") {
      intPart = rawDec !== undefined ? "0" : "";
    }

    if (rawDec === undefined) {
      setValue("amount", intPart, { shouldDirty: true, shouldValidate: false });
      return;
    }

    const decPart = rawDec.slice(0, 2);
    if (decPart === "") {
      setValue("amount", intPart + ".", { shouldDirty: true, shouldValidate: false });
      return;
    }

    setValue("amount", `${intPart}.${decPart}`, { shouldDirty: true, shouldValidate: false });
  }

  const onSubmit: SubmitHandler<NewPaymentLinkValues> = async (values) => {
    try {
      // Map UI -> API enum
      const payload = {
        name: values.name.trim(),
        mode: values.mode === "fixed" ? "FIXED" : "VARIABLE",
        amount: values.mode === "fixed" ? (values.amount ?? "").trim() || null : null,
        description: (values.description ?? "").trim() || null,
        isActive: true,
      };

      const res = await fetch("/api/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Failed to create payment link");
      }

      const created = data.link as CreatedLink;

      toast({
        title: "Payment link created",
        variant: "success",
        message: "Your link is ready to share.",
      });

      onCreated?.(created);

      reset({ name: "", mode: "fixed", amount: "", description: "" });
      handleClose();
    } catch (e) {
      toast({
        title: "Couldn’t create link",
        variant: "error",
        message: e instanceof Error ? e.message : "Please try again.",
      });
    }
  };

  return (
    <>
      <Button variant="primary" size={size} onClick={handleOpen}>
        Create payment link
      </Button>

      {open && (
        <div
          className={
            "fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 transition-opacity duration-200 " +
            (visible ? "opacity-100" : "opacity-0")
          }
        >
          <div
            className={
              "w-full max-w-md rounded-2xl border border-border bg-white shadow-[0_18px_55px_rgba(15,17,21,0.18)] transition-all duration-200 " +
              (visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0")
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div>
                <h2 className="text-sm font-semibold tracking-[-0.02em]">New payment link</h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  Create a shareable checkout link in minutes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body */}
            <form className="space-y-4 px-5 pb-5 pt-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="link-name" className="text-xs font-medium text-foreground">
                  Payment name
                </label>
                <input
                  id="link-name"
                  type="text"
                  {...register("name")}
                  className={errors.name ? errorInput : normalInput}
                  placeholder="Design retainer – March"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-[11px] text-[#ef4444]">{errors.name.message}</p>}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Amount</label>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setValue("mode", "fixed", { shouldDirty: true, shouldValidate: true })
                    }
                    className={
                      "flex flex-col items-start rounded-md border px-3 py-2 text-left text-xs transition disabled:opacity-70 " +
                      (mode === "fixed"
                        ? "border-accent bg-accent-soft shadow-sm"
                        : "border-border bg-surface hover:bg-white")
                    }
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-foreground">Fixed amount</span>
                      <span className={"h-1.5 w-1.5 rounded-full " + (mode === "fixed" ? "bg-accent" : "bg-border")} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">You set one USD amount.</p>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      setValue("mode", "variable", { shouldDirty: true, shouldValidate: true })
                    }
                    className={
                      "flex flex-col items-start rounded-md border px-3 py-2 text-left text-xs transition disabled:opacity-70 " +
                      (mode === "variable"
                        ? "border-accent bg-accent-soft shadow-sm"
                        : "border-border bg-surface hover:bg-white")
                    }
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-foreground">Customer decides</span>
                      <span className={"h-1.5 w-1.5 rounded-full " + (mode === "variable" ? "bg-accent" : "bg-border")} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">Customer enters the amount.</p>
                  </button>
                </div>

                <input type="hidden" {...register("mode")} />

                {mode === "fixed" && (
                  <div className="mt-2 space-y-1">
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-muted">
                        USD
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        {...register("amount", {
                          onChange: (event) => handleAmountChange(event.target.value),
                        })}
                        value={amountValue}
                        className={(errors.amount ? errorInput : normalInput) + " pl-11"}
                        placeholder="500 or 30.50"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-[11px] text-[#ef4444]">{errors.amount.message as string}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Description (this is what you will render under payment name on checkout) */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-medium text-foreground">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  className={(errors.description ? errorInput : normalInput) + " resize-none"}
                  placeholder="Short note the customer will see on checkout (e.g. invoice period, project scope)."
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-[11px] text-[#ef4444]">{errors.description.message}</p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button type="button" onClick={handleClose} className="text-action text-[11px]" disabled={isSubmitting}>
                  Cancel
                </button>

                <Button type="submit" size="sm" className="justify-center" disabled={isSubmitting}>
                  <span className="inline-flex items-center gap-2">
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Creating…" : "Create link"}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
