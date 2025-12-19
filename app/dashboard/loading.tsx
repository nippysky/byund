// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="px-4 pb-10 pt-4 md:px-6 md:pt-6 lg:px-8" aria-busy="true" aria-live="polite">
      {/* Header skeleton */}
      <div className="mb-6 md:mb-8">
        <div className="h-3 w-28 rounded-full bg-surface/80 animate-pulse" />
        <div className="mt-3 h-8 w-56 rounded-xl bg-surface/80 animate-pulse" />
        <div className="mt-2 h-4 w-[520px] max-w-full rounded-lg bg-surface/70 animate-pulse" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      {/* Recent activity skeleton */}
      <div className="mt-8 rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded-lg bg-surface/70 animate-pulse" />
          <div className="h-3 w-24 rounded-full bg-surface/60 animate-pulse" />
        </div>

        <div className="mt-4 divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="h-4 w-60 max-w-full rounded-lg bg-surface/70 animate-pulse" />
                <div className="mt-2 h-3 w-[320px] max-w-full rounded-lg bg-surface/60 animate-pulse" />
                <div className="mt-2 h-3 w-24 rounded-lg bg-surface/50 animate-pulse" />
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden h-4 w-20 rounded-lg bg-surface/60 animate-pulse sm:block" />
                <div className="h-6 w-20 rounded-full bg-surface/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-3 w-36 rounded-full bg-surface/70 animate-pulse" />
          <div className="mt-3 h-8 w-28 rounded-xl bg-surface/80 animate-pulse" />
          <div className="mt-2 h-3 w-40 rounded-lg bg-surface/60 animate-pulse" />
        </div>
        <div className="h-9 w-9 rounded-xl bg-surface/70 animate-pulse" />
      </div>
    </div>
  );
}
