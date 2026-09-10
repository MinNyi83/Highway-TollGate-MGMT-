interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-4 ${className}`} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-6 w-1/3" />
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-4 w-2/3" />
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-8 w-1/2" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card p-6 space-y-3">
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-6 w-1/4 mb-4" />
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-4 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-4 flex-1" />
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-4 flex-1" />
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-6 w-1/3" />
      <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-64 w-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
