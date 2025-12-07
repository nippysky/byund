// app/dashboard/settings/page.tsx
import PageHeader from "@/components/dashboard/PageHeader";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your business profile, settlement wallet, and developer settings."
      />

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">
            Business profile
          </p>
          <p className="mt-2 text-sm text-muted">
            In V1, this will store your business name and contact email. Later
            we can add more KYB details here.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">
            Settlement wallet
          </p>
          <p className="mt-2 text-sm text-muted">
            Configure the wallet that receives your USDC settlements on the
            supported network (e.g. Base USDC). This is core to V1.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 md:p-6">
          <p className="text-sm font-medium tracking-[-0.01em]">
            API & keys
          </p>
          <p className="mt-2 text-sm text-muted">
            Test and live keys will live here, along with webhook signing
            secrets. For now, this is just the structural placeholder.
          </p>
        </div>
      </div>
    </div>
  );
}
