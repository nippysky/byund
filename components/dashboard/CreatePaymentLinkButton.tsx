"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

const paymentLinkSchema = z
  .object({
    name: z.string().min(1, "Enter a name for this link."),
    mode: z.enum(["fixed", "variable"]),
    amount: z.string().optional(),
    description: z.string().max(280, "Description is too long").optional(),
  })
  .superRefine((values, ctx) => {
    if (values.mode === "fixed") {
      const raw = values.amount ?? "";

      // Allow transient "0." while typing, but treat it as invalid on submit
      if (!raw.trim() || raw === "0." || raw === ".") {
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
    }
  });

export type NewPaymentLinkValues = z.infer<typeof paymentLinkSchema>;

type CreatePaymentLinkButtonProps = {
  size?: "sm" | "md";
  onCreated?: (values: NewPaymentLinkValues) => void;
};

export function CreatePaymentLinkButton({
  size = "sm",
  onCreated,
}: CreatePaymentLinkButtonProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false); // for smooth animation

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

  // React Compiler warning is fine here; watch is scoped to this component.
  // eslint-disable-next-line react-hooks/incompatible-library
  const mode = watch("mode") || "fixed";
  const amountValue = watch("amount") ?? "";

  const baseInput =
    "block w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ring-0 transition-colors";
  const normalInput =
    baseInput + " border-border focus:border-accent focus:ring-1 focus:ring-accent";
  const errorInput =
    baseInput +
    " border-[#ef4444] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]";

  async function onSubmit(values: NewPaymentLinkValues) {
    console.log("New payment link:", values);
    if (onCreated) {
      onCreated(values);
    }

    reset({
      name: "",
      mode: "fixed",
      amount: "",
      description: "",
    });
    handleClose();
  }

  function handleOpen() {
    setOpen(true);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(true);
    }
  }

  function handleClose() {
    setVisible(false);
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        setOpen(false);
      }, 180);
    } else {
      setOpen(false);
    }
  }

  // 🔥 Better money input behaviour:
  // - Only digits and one dot
  // - Allows "0.", "10." while typing
  // - Max 2 decimal places
  function handleAmountChange(raw: string) {
    // Strip everything except digits and dot
    let cleaned = raw.replace(/[^\d.]/g, "");

    // If there are multiple dots, keep the first and remove the rest
    const firstDotIndex = cleaned.indexOf(".");
    if (firstDotIndex !== -1) {
      const before = cleaned.slice(0, firstDotIndex + 1);
      const after = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
      cleaned = before + after;
    }

    // Special case: just "." => "0."
    if (cleaned === ".") {
      setValue("amount", "0.", {
        shouldDirty: true,
        shouldValidate: false,
      });
      return;
    }

    const [rawInt = "", rawDec] = cleaned.split(".");

    // Normalize integer part: avoid weird leading zeros, but allow "0"
    let intPart = rawInt.replace(/^0+(?=\d)/, "");
    if (intPart === "") {
      intPart = rawDec !== undefined ? "0" : "";
    }

    if (rawDec === undefined) {
      // No decimals at all
      setValue("amount", intPart, {
        shouldDirty: true,
        shouldValidate: false,
      });
      return;
    }

    // There *is* a decimal point: limit to 2 decimal digits
    const decPart = rawDec.slice(0, 2);

    // If user just typed "0." or "10.", keep the trailing dot visible
    if (decPart === "") {
      setValue("amount", intPart + ".", {
        shouldDirty: true,
        shouldValidate: false,
      });
      return;
    }

    setValue("amount", `${intPart}.${decPart}`, {
      shouldDirty: true,
      shouldValidate: false,
    });
  }

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
              (visible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-2 scale-95 opacity-0")
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <div>
                <h2 className="text-sm font-semibold tracking-[-0.02em]">
                  New payment link
                </h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  Define a simple USD link you can share with customers.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body */}
            <form
              className="space-y-4 px-5 pb-5 pt-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="link-name"
                  className="text-xs font-medium text-foreground"
                >
                  Link name
                </label>
                <input
                  id="link-name"
                  type="text"
                  {...register("name")}
                  className={errors.name ? errorInput : normalInput}
                  placeholder="Invoice for Sam'Alia, Retainer for NIPPY Studio…"
                />
                {errors.name && (
                  <p className="text-[11px] text-[#ef4444]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Amount section */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Amount
                </label>

                {/* Card-style selection under label */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      setValue("mode", "fixed", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={
                      "flex flex-col items-start rounded-md border px-3 py-2 text-left text-xs transition " +
                      (mode === "fixed"
                        ? "border-accent bg-accent-soft shadow-sm"
                        : "border-border bg-surface hover:bg-white")
                    }
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-foreground">
                        Fixed amount
                      </span>
                      <span
                        className={
                          "h-1.5 w-1.5 rounded-full " +
                          (mode === "fixed" ? "bg-accent" : "bg-border")
                        }
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      You set a single USD amount for every payment.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setValue("mode", "variable", {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={
                      "flex flex-col items-start rounded-md border px-3 py-2 text-left text-xs transition " +
                      (mode === "variable"
                        ? "border-accent bg-accent-soft shadow-sm"
                        : "border-border bg-surface hover:bg-white")
                    }
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-foreground">
                        Customer decides
                      </span>
                      <span
                        className={
                          "h-1.5 w-1.5 rounded-full " +
                          (mode === "variable" ? "bg-accent" : "bg-border")
                        }
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-muted">
                      Customer enters the USD amount at checkout.
                    </p>
                  </button>
                </div>

                {/* Hidden field so RHF still tracks mode */}
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
                          onChange: (event) =>
                            handleAmountChange(event.target.value),
                        })}
                        value={amountValue}
                        className={
                          (errors.amount ? errorInput : normalInput) + " pl-11"
                        }
                        placeholder="100 or 30.50"
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-[11px] text-[#ef4444]">
                        {errors.amount.message as string}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label
                  htmlFor="description"
                  className="text-xs font-medium text-foreground"
                >
                  Internal note (optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  className={
                    (errors.description ? errorInput : normalInput) +
                    " resize-none"
                  }
                  placeholder="e.g. Monthly retainer for March, or project name."
                />
                {errors.description && (
                  <p className="text-[11px] text-[#ef4444]">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Footer actions */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-action text-[11px]"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  size="sm"
                  className="justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating…" : "Create link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
