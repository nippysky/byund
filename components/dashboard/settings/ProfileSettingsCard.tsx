"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ProfileSettingsCard({
  initial,
}: {
  initial: {
    publicName: string;
    email: string;
  };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [publicName, setPublicName] = useState(initial.publicName);
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(
    () => publicName.trim() !== initial.publicName.trim(),
    [publicName, initial.publicName]
  );

  const trimmed = publicName.trim();
  const canSave =
    !saving && trimmed.length >= 2 && trimmed.length <= 80 && dirty;

  async function onSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/settings/profile", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicName: trimmed }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Failed");

      toast({
        title: "Saved",
        variant: "success",
        message: "Business profile updated.",
      });
      router.refresh();
    } catch {
      toast({
        title: "Update failed",
        variant: "error",
        message: "Try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-[0_8px_25px_rgba(15,17,21,0.06)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[-0.01em]">
              Business profile
            </p>
            <p className="mt-1 text-sm text-muted">
              This name appears on your checkout (the “Payment to …” panel).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPublicName(initial.publicName)}
              disabled={saving || !dirty}
            >
              Reset
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

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Public name
            </label>
            <input
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
              className="block w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="e.g. NIPPYSKY"
              maxLength={80}
            />
            <p className="text-[11px] text-muted">
              {trimmed.length < 2 ? "Minimum 2 characters." : " "}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Contact email
            </label>
            <input
              value={initial.email}
              readOnly
              className="block w-full cursor-not-allowed rounded-xl border border-border bg-surface px-3 py-3 text-sm text-foreground/80 outline-none"
            />
            <p className="text-[11px] text-muted">Read-only in V1.</p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-surface/40 p-3 text-[11px] text-muted">
          <span className="font-medium text-foreground">Heads-up:</span>{" "}
          The dashboard uses Africa/Lagos time (WAT) for consistency.
        </div>
      </div>
    </div>
  );
}
