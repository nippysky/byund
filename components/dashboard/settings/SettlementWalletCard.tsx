// components/dashboard/settings/SettlementWalletCard.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, Pencil, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getAddress, isAddress } from "viem";

export default function SettlementWalletCard({
  initial,
}: {
  initial: { settlementWallet: string };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const initialTrimmed = (initial.settlementWallet ?? "").trim();

  // ✅ View-first: input disabled until Edit
  const [isEditing, setIsEditing] = useState<boolean>(initialTrimmed.length === 0 ? true : false);

  const [wallet, setWallet] = useState<string>(initialTrimmed);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  const trimmed = wallet.trim();

  const dirty = useMemo(() => trimmed !== initialTrimmed, [trimmed, initialTrimmed]);

  const validity = useMemo(() => {
    if (!trimmed) return { ok: false, reason: "Add a wallet to receive settlements." };
    if (!isAddress(trimmed)) return { ok: false, reason: "Enter a valid EVM address." };
    return { ok: true as const, checksum: getAddress(trimmed) };
  }, [trimmed]);

  const canSave = isEditing && dirty && validity.ok && !saving && !checking;

  async function verifyNow() {
    // “Payable wallet” in V1 = valid EVM address + checksum normalization.
    // (A true onchain “can receive” check would require RPC + chain rules.)
    setChecking(true);
    try {
      if (!trimmed) {
        toast({ title: "Enter a wallet", variant: "warning", message: "Paste a Base (EVM) address first." });
        return;
      }
      if (!isAddress(trimmed)) {
        toast({ title: "Invalid address", variant: "error", message: "Enter a valid EVM address." });
        return;
      }

      const checksummed = getAddress(trimmed);
      setWallet(checksummed);

      toast({
        title: "Verified",
        variant: "success",
        message: "Address looks valid and is correctly formatted.",
      });
    } finally {
      setChecking(false);
    }
  }

  async function onCopy(addr: string) {
    try {
      if (!addr) return;
      await navigator.clipboard.writeText(addr);
      toast({ title: "Copied", message: "Wallet address copied." });
    } catch {
      toast({ title: "Copy failed", variant: "error", message: "Try again." });
    }
  }

  async function onSave() {
    if (!canSave) return;

    setSaving(true);
    try {
      const checksummed = getAddress(trimmed);

      const res = await fetch("/api/dashboard/settings/wallet", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settlementWallet: checksummed }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");

      toast({
        title: "Saved",
        variant: "success",
        message: "Settlement wallet updated.",
      });

      // Exit edit mode, refresh server data
      setIsEditing(false);
      router.refresh();
    } catch {
      toast({ title: "Update failed", variant: "error", message: "Try again." });
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    if (saving || checking) return;
    setWallet(initialTrimmed);
    setIsEditing(false);
  }

  const viewWallet = initialTrimmed;

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_8px_25px_rgba(15,17,21,0.06)] md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[-0.01em]">Settlement wallet</p>
          <p className="mt-1 text-sm text-muted">
            Where your settlements arrive. Network: <span className="font-medium">Base</span>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              {viewWallet ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onCopy(viewWallet)}
                  className="inline-flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              ) : null}

              <Button size="sm" onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                {viewWallet ? "Edit" : "Add wallet"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={onCancel}
                disabled={saving || checking}
                className="inline-flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>

              <Button size="sm" onClick={onSave} disabled={!canSave}>
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* View mode */}
      {!isEditing ? (
        <div className="mt-5 rounded-2xl border border-border bg-surface/40 p-4">
          {viewWallet ? (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Current wallet
                </p>
                <p className="mt-2 truncate font-mono text-[13px] text-foreground">
                  {viewWallet}
                </p>
                <p className="mt-2 text-[11px] text-muted">
                  This wallet receives settlements directly. Keep it accurate.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                Set
              </span>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium tracking-[-0.01em] text-foreground">No wallet yet</p>
              <p className="mt-1 text-sm text-muted">
                Add a Base wallet address to receive settlements.
              </p>
              <div className="mt-3">
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  Add wallet
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Edit mode */
        <>
          <div className="mt-5 space-y-1.5">
            <label className="text-xs font-medium text-foreground">Base (EVM) address</label>

            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              onBlur={() => {
                // lightweight: normalize on blur if valid
                if (wallet.trim() && isAddress(wallet.trim())) {
                  setWallet(getAddress(wallet.trim()));
                }
              }}
              className="block w-full rounded-xl border border-border bg-white px-3 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-70"
              placeholder="0x…"
              inputMode="text"
              autoComplete="off"
              disabled={saving || checking}
            />

            {!trimmed ? (
              <p className="text-[11px] text-muted">Paste your wallet address.</p>
            ) : !validity.ok ? (
              <p className="text-[11px] text-[#ef4444]">{validity.reason}</p>
            ) : (
              <p className="text-[11px] text-muted">
                Looks valid. We’ll save it in checksum format.
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={verifyNow}
              disabled={saving || checking}
              className="inline-flex items-center gap-2"
            >
              {checking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Verify address
                </>
              )}
            </Button>

            {trimmed ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCopy(trimmed)}
                disabled={saving || checking}
                className="inline-flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            ) : null}
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-surface/40 p-3 text-[11px] text-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-muted" />
            <div>
              <p className="font-medium text-foreground">Safety note</p>
              <p className="mt-0.5">
                Use a wallet you control. If you paste the wrong address, settlements can’t be recovered.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
