export default function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03] select-none">
      <div className="absolute -rotate-30 top-1/4 left-1/4 text-6xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
        NYIMIN © 2026
      </div>
      <div className="absolute -rotate-30 top-2/4 left-1/4 text-6xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
        NYIMIN © 2026
      </div>
      <div className="absolute -rotate-30 top-3/4 left-1/4 text-6xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
        NYIMIN © 2026
      </div>
    </div>
  );
}
