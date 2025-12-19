// app/dashboard/settings/developers/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import PageHeader from "@/components/dashboard/PageHeader";
import DeveloperSettingsCard from "@/components/dashboard/settings/DeveloperSettingsCard";

export default async function DevelopersSettingsPage() {
  noStore();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Settings"
        description="Configure your business profile, settlement wallet, and developer settings."
      />

      <DeveloperSettingsCard />
    </div>
  );
}
