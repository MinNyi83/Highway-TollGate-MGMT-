interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200 dark:bg-navy-700 rounded ${className}`}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-4 animate-pulse border border-slate-200/60 dark:border-navy-700/40">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 dark:bg-navy-700 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 dark:bg-navy-700 rounded w-1/3 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-navy-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow overflow-hidden border border-slate-200/60 dark:border-navy-700/40">
      <div className="bg-slate-50 dark:bg-navy-700/40 p-4">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-200 dark:bg-navy-600 rounded flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-t border-slate-200/40 dark:border-navy-600/30">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-3 bg-slate-200 dark:bg-navy-700 rounded flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-6 animate-pulse border border-slate-200/60 dark:border-navy-700/40">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-200 dark:bg-navy-700 rounded-lg" />
        <div>
          <div className="h-3 bg-slate-200 dark:bg-navy-700 rounded w-20 mb-2" />
          <div className="h-6 bg-slate-200 dark:bg-navy-700 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-slate-200 dark:bg-navy-700 rounded w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-6 border border-slate-200/60 dark:border-navy-700/40">
          <div className="h-6 bg-slate-200 dark:bg-navy-700 rounded w-48 mb-4" />
          <div className="h-64 bg-slate-100 dark:bg-navy-700/40 rounded" />
        </div>
        <div className="bg-white dark:bg-navy-800/60 rounded-lg shadow p-6 border border-slate-200/60 dark:border-navy-700/40">
          <div className="h-6 bg-slate-200 dark:bg-navy-700 rounded w-48 mb-4" />
          <div className="h-64 bg-slate-100 dark:bg-navy-700/40 rounded" />
        </div>
      </div>
    </div>
  );
}
