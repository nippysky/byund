"use client";

import { useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Wallet,
  Building2,
  Palette,
} from "lucide-react";
import { AnimatePresence, motion, type Variants, easeIn, easeOut } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { isAddress, getAddress } from "viem";

const DEFAULT_BRAND_BG = "#0066FF";
const DEFAULT_BRAND_TEXT = "#FFFFFF";

function isHexColor(s: string) {
  return /^#([0-9a-fA-F]{6})$/.test(s.trim());
}

type Props = {
  nextPath: string;
  initialStep?: number; // 0..3
  initial: {
    publicName: string;
    email: string;
    settlementWallet: string;
    brandBg: string;
    brandText: string;
  };
};

type StepId = "profile" | "wallet" | "branding" | "done";

const STEPS: Array<{
  id: StepId;
  kicker: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    id: "profile",
    kicker: "Step 1",
    title: "Confirm your business name",
    description: "This appears on checkout as “Payment to …”.",
    icon: Building2,
  },
  {
    id: "wallet",
    kicker: "Step 2",
    title: "Add your settlement wallet",
    description: "USDC on Base settles directly to this address (BYUND never holds funds).",
    icon: Wallet,
  },
  {
    id: "branding",
    kicker: "Step 3",
    title: "Match your brand",
    description: "Pick simple colors used on the left panel of checkout.",
    icon: Palette,
  },
  {
    id: "done",
    kicker: "Done",
    title: "You’re ready",
    description: "Create your first payment link in under a minute.",
    icon: CheckCircle2,
  },
];

const cardVariants: Variants = {
  initial: (dir: 1 | -1) => ({
    opacity: 0,
    x: dir === 1 ? 28 : -28,
    y: 6,
    filter: "blur(2px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: easeOut },
  },
  exit: (dir: 1 | -1) => ({
    opacity: 0,
    x: dir === 1 ? -22 : 22,
    y: 2,
    filter: "blur(2px)",
    transition: { duration: 0.2, ease: easeIn },
  }),
};

function clampStep(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(Math.floor(n), 0), 3);
}

async function postJson(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? "{}" : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");
  return data;
}

function validateWallet(input: string): { ok: true; value: string } | { ok: false; error: string } {
  const s = input.trim();
  if (!s) return { ok: false, error: "Enter a wallet address." };
  if (!isAddress(s)) return { ok: false, error: "Enter a valid EVM address." };

  const checksummed = getAddress(s);
  if (checksummed.toLowerCase() === "0x0000000000000000000000000000000000000000") {
    return { ok: false, error: "Zero address can’t receive funds." };
  }

  return { ok: true, value: checksummed };
}

export default function OnboardingClient({ nextPath, initial, initialStep = 0 }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [stepIndex, setStepIndex] = useState(() => clampStep(initialStep));
  const step = STEPS[stepIndex];

  const [dir, setDir] = useState<1 | -1>(1);

  const [publicName, setPublicName] = useState(initial.publicName);

  const [wallet, setWallet] = useState(initial.settlementWallet);
  const [walletTouched, setWalletTouched] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [hasSavedWallet, setHasSavedWallet] = useState(Boolean(initial.settlementWallet));

  const [brandBg, setBrandBg] = useState(initial.brandBg || DEFAULT_BRAND_BG);
  const [brandText, setBrandText] = useState(initial.brandText || DEFAULT_BRAND_TEXT);

  const [saving, setSaving] = useState(false);

  const profileValid = publicName.trim().length >= 2 && publicName.trim().length <= 80;

  const walletCheck = useMemo(() => validateWallet(wallet), [wallet]);
  const walletValid = walletCheck.ok;

  const brandingValid = isHexColor(brandBg) && isHexColor(brandText);

  const canContinue = useMemo(() => {
    if (saving) return false;
    if (step.id === "profile") return profileValid;
    if (step.id === "wallet") return walletValid;
    if (step.id === "branding") return brandingValid;
    return true;
  }, [saving, step.id, profileValid, walletValid, brandingValid]);

  async function saveProfile() {
    await postJson("/api/onboarding/profile", { publicName: publicName.trim() });
  }

  async function saveWallet() {
    // client-side validator first (nice UX)
    const v = validateWallet(wallet);
    if (!v.ok) throw new Error(v.error);

    // normalize display to checksum for the user
    setWallet(v.value);

    // server validates too
    await postJson("/api/onboarding/wallet", { settlementWallet: v.value });
    setHasSavedWallet(true);
  }

  async function saveBranding() {
    await postJson("/api/onboarding/branding", {
      brandBg: brandBg.trim(),
      brandText: brandText.trim(),
    });
  }

  async function completeOnboardingAndGo(path: string) {
    setSaving(true);
    try {
      await postJson("/api/onboarding/complete");
      window.location.assign(path);
    } catch (e) {
      toast({
        title: "Couldn’t finish",
        variant: "error",
        message: e instanceof Error ? e.message : "Try again.",
      });
      setSaving(false);
    }
  }

  async function applyDefaultBranding(saveNow: boolean) {
    setBrandBg(DEFAULT_BRAND_BG);
    setBrandText(DEFAULT_BRAND_TEXT);

    if (!saveNow) return;

    setSaving(true);
    try {
      await postJson("/api/onboarding/branding", {
        brandBg: DEFAULT_BRAND_BG,
        brandText: DEFAULT_BRAND_TEXT,
      });
      toast({ title: "Default colors applied", variant: "success", message: "BYUND blue + white." });
    } catch (e) {
      toast({
        title: "Couldn’t apply defaults",
        variant: "error",
        message: e instanceof Error ? e.message : "Try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function onContinue() {
    if (!canContinue) return;

    setSaving(true);
    try {
      if (step.id === "profile") {
        await saveProfile();
      }

      if (step.id === "wallet") {
        setWalletTouched(true);
        setWalletError(walletCheck.ok ? null : walletCheck.error);
        if (!walletCheck.ok) throw new Error(walletCheck.error);

        await saveWallet();
      }

      if (step.id === "branding") {
        await saveBranding();
        toast({
          title: "Saved",
          variant: "success",
          message: "Brand colors updated.",
        });
      }

      // ✅ IMPORTANT: never refresh the server page here
      // The server page is allowed to redirect (and we want to avoid accidental jumps).
      // We only progress locally and let completion be explicit.
      setDir(1);
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    } catch (e) {
      toast({
        title: "Couldn’t save",
        variant: "error",
        message: e instanceof Error ? e.message : "Try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  function onBack() {
    if (saving) return;
    if (stepIndex === 0) return;
    setDir(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function finishLater() {
    // ✅ Creative + robust:
    // - Before wallet is saved: push them to wallet settings (because wallet is required for links)
    // - After wallet (and beyond): allow skipping directly to overview (nextPath)
    if (!hasSavedWallet) {
      router.push("/dashboard/settings/wallet");
      return;
    }
    router.push(nextPath);
  }

  function onWalletBlur() {
    setWalletTouched(true);
    setWalletError(walletCheck.ok ? null : walletCheck.error);
  }

  const Icon = step.icon;

  const progressPct = useMemo(() => {
    const total = STEPS.length - 1; // exclude done from denominator
    const clamped = Math.min(stepIndex, total);
    return Math.round((clamped / total) * 100);
  }, [stepIndex]);

  const baseInput =
    "block w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

  const showFinishLater = step.id !== "done";

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 md:px-6 md:py-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-[18px] font-semibold tracking-[-0.04em] text-foreground">BYUND</span>
        </Link>

        {showFinishLater ? (
          <button
            type="button"
            onClick={finishLater}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-[11px] text-muted hover:text-foreground disabled:opacity-60"
            disabled={saving}
          >
            {hasSavedWallet ? "Skip to dashboard" : "Finish later"}
          </button>
        ) : null}
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 pb-10 md:px-6">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">Onboarding</p>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-4 flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-white">
              <Icon className="h-4 w-4 text-foreground/80" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                {step.kicker}
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {step.title}
              </h1>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-xl">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={step.id}
              custom={dir}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="rounded-3xl border border-border bg-white p-5 shadow-[0_18px_55px_rgba(15,17,21,0.10)] md:p-7"
            >
              {step.id === "profile" ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.01em]">Business profile</p>
                      <p className="mt-1 text-sm text-muted">Shown to customers on checkout.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyDefaultBranding(true)}
                      disabled={saving}
                      className="text-[11px] font-medium text-action hover:underline disabled:opacity-60"
                      title="Set checkout colors to BYUND defaults"
                    >
                      Reset colors to default
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Business name</label>
                    <input
                      value={publicName}
                      onChange={(e) => setPublicName(e.target.value)}
                      className={baseInput}
                      placeholder="e.g. NIPPY Studio"
                      maxLength={80}
                      disabled={saving}
                    />
                    <p className={"text-[11px] " + (profileValid ? "text-muted" : "text-[#ef4444]")}>
                      {profileValid ? "Looks good." : "Minimum 2 characters (max 80)."}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Contact email</label>
                    <input
                      value={initial.email}
                      readOnly
                      className="block w-full cursor-not-allowed rounded-xl border border-border bg-surface px-3 py-3 text-sm text-foreground/80 outline-none"
                    />
                    <p className="text-[11px] text-muted">Read-only in V1.</p>
                  </div>

                  <div
                    className="rounded-2xl border border-border p-4"
                    style={{ background: brandBg, color: brandText }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.8 }}>
                      Checkout preview
                    </p>
                    <p className="mt-2 text-[16px] font-semibold tracking-[-0.03em]">
                      Payment to {publicName.trim() || "Your Business"}
                    </p>
                    <p className="mt-1 text-[12px]" style={{ opacity: 0.85 }}>
                      (You can tweak this later in Branding.)
                    </p>
                  </div>
                </div>
              ) : null}

              {step.id === "wallet" ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold tracking-[-0.01em]">Settlement wallet</p>
                    <p className="mt-1 text-sm text-muted">This address receives USDC on Base directly.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Wallet address</label>
                    <input
                      value={wallet}
                      onChange={(e) => {
                        setWallet(e.target.value);
                        if (walletTouched) {
                          const next = validateWallet(e.target.value);
                          setWalletError(next.ok ? null : next.error);
                        }
                      }}
                      onBlur={onWalletBlur}
                      className={baseInput + " font-mono"}
                      placeholder="0x…"
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      disabled={saving}
                    />
                    {walletTouched && walletError ? (
                      <p className="text-[11px] text-[#ef4444]">{walletError}</p>
                    ) : (
                      <p className="text-[11px] text-muted">
                        We’ll validate your address before saving.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-surface/40 p-3 text-[11px] text-muted">
                    <span className="font-medium text-foreground">Time note:</span>{" "}
                    Dashboard timestamps show <span className="font-medium">Africa/Lagos (WAT)</span>.
                  </div>

                  {hasSavedWallet ? (
                    <div className="rounded-2xl border border-border bg-white p-3 text-[11px] text-muted">
                      Wallet saved. You can{" "}
                      <button
                        type="button"
                        onClick={() => router.push(nextPath)}
                        className="font-medium text-action hover:underline"
                        disabled={saving}
                      >
                        skip to dashboard
                      </button>{" "}
                      now, or continue to branding.
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step.id === "branding" ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.01em]">Branding</p>
                      <p className="mt-1 text-sm text-muted">
                        Simple V1: background + text used on the left panel of checkout.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyDefaultBranding(false)}
                      disabled={saving}
                      className="text-[11px] font-medium text-action hover:underline disabled:opacity-60"
                      title="Reset fields to BYUND defaults"
                    >
                      Use defaults
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Brand background</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isHexColor(brandBg) ? brandBg : DEFAULT_BRAND_BG}
                          onChange={(e) => setBrandBg(e.target.value)}
                          className="h-10 w-12 cursor-pointer rounded-xl border border-border bg-white p-1"
                          aria-label="Pick brand background color"
                          disabled={saving}
                        />
                        <input
                          value={brandBg}
                          onChange={(e) => setBrandBg(e.target.value)}
                          className={baseInput + " font-mono"}
                          placeholder="#RRGGBB"
                          maxLength={7}
                          disabled={saving}
                        />
                      </div>
                      <p className={"text-[11px] " + (isHexColor(brandBg) ? "text-muted" : "text-[#ef4444]")}>
                        {isHexColor(brandBg) ? "Looks good." : "Use a hex color like #0066FF"}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Brand text</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={isHexColor(brandText) ? brandText : DEFAULT_BRAND_TEXT}
                          onChange={(e) => setBrandText(e.target.value)}
                          className="h-10 w-12 cursor-pointer rounded-xl border border-border bg-white p-1"
                          aria-label="Pick brand text color"
                          disabled={saving}
                        />
                        <input
                          value={brandText}
                          onChange={(e) => setBrandText(e.target.value)}
                          className={baseInput + " font-mono"}
                          placeholder="#RRGGBB"
                          maxLength={7}
                          disabled={saving}
                        />
                      </div>
                      <p className={"text-[11px] " + (isHexColor(brandText) ? "text-muted" : "text-[#ef4444]")}>
                        {isHexColor(brandText) ? "Looks good." : "Use a hex color like #FFFFFF"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-3xl border border-border p-5"
                    style={{
                      background: isHexColor(brandBg) ? brandBg : DEFAULT_BRAND_BG,
                      color: isHexColor(brandText) ? brandText : DEFAULT_BRAND_TEXT,
                    }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em]" style={{ opacity: 0.8 }}>
                      Preview
                    </p>
                    <p className="mt-2 text-[18px] font-semibold tracking-[-0.03em] md:text-[20px]">
                      Payment to {publicName.trim() || "Your Business"}
                    </p>
                    <p className="mt-1 text-[12px]" style={{ opacity: 0.85 }}>
                      This is how the left panel will feel for your customers.
                    </p>
                  </div>
                </div>
              ) : null}

              {step.id === "done" ? (
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-white">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.01em]">You’re set.</p>
                      <p className="mt-1 text-sm text-muted">
                        Choose what you want to do next — we won’t auto-redirect.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={() => completeOnboardingAndGo("/dashboard/payment-links")}
                      className="justify-center"
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Finishing…
                        </span>
                      ) : (
                        "Create payment link"
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => completeOnboardingAndGo(nextPath)}
                      className="justify-center"
                      disabled={saving}
                    >
                      Go to dashboard
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface/40 p-3 text-[11px] text-muted">
                    You can update business name, wallet, and branding anytime in Settings.
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] text-muted">
              Step{" "}
              <span className="font-medium text-foreground">{Math.min(stepIndex + 1, STEPS.length)}</span>{" "}
              of <span className="font-medium text-foreground">{STEPS.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={onBack} disabled={saving || stepIndex === 0}>
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </span>
              </Button>

              {step.id !== "done" ? (
                <Button size="sm" onClick={onContinue} disabled={!canContinue}>
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              ) : null}
            </div>
          </div>

          {step.id !== "done" ? (
            <p className="mt-3 text-center text-[11px] text-muted">
              This setup takes ~30 seconds. You can edit everything later in Settings.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
