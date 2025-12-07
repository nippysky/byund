// app/dashboard/loading.tsx
import SkeletonCard from "@/components/dashboard/SkeletonCard";

export default function DashboardLoading() {
  return (
    <div className="px-4 pb-10 pt-4 md:px-6 md:pt-6 lg:px-8">
      <div className="mb-6 h-7 w-40 animate-pulse rounded-md bg-surface/80 md:mb-8" />
      <div className="grid gap-4 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div className="mt-8">
        <SkeletonCard className="h-32" />
      </div>
    </div>
  );
}
