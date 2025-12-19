"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function isEvmAddress(addr: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}

export default function SettlementWalletCard({
  initial,
}: {
  initial: { settlementWallet: string };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [wallet, setWallet] = useState(initial.settlementWallet ?? "");
  const [saving, setSaving] = useState(false);

  const trimmed = wallet.trim();
  const dirty = useMemo(() => trimmed !== (initial.settlementWallet ?? "").trim(), [trimmed, initial.settlementWallet]);

  const valid = trimmed.length === 0 || isEvmAddress(trimmed);
  const canSave = dirty && valid && !saving;

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/settings/wallet", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settlementWallet: trimmed || null }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");

      toast({
        title: "Saved",
        variant: "success",
        message: trimmed ? "Settlement wallet updated." : "Settlement wallet cleared.",
      });
      router.refresh();
    } catch {
      toast({ title: "Update failed", variant: "error", message: "Try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_8px_25px_rgba(15,17,21,0.06)] md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[-0.01em]">Settlement wallet</p>
          <p className="mt-1 text-sm text-muted">
            Where your USDC settlements arrive. Network: <span className="font-medium">Base</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setWallet("")} disabled={saving || !trimmed}>
            Clear
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
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <label className="text-xs font-medium text-foreground">Base (EVM) address</label>
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          className="block w-full rounded-xl border border-border bg-white px-3 py-3 font-mono text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
          placeholder="0x…"
          inputMode="text"
          autoComplete="off"
        />
        {!valid ? (
          <p className="text-[11px] text-[#ef4444]">Enter a valid 0x address (40 hex chars).</p>
        ) : (
          <p className="text-[11px] text-muted">
            Make sure this wallet is yours. BYUND never holds your funds.
          </p>
        )}
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
    </div>
  );
}
