export default function Watermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden opacity-[0.02] select-none">
      <div className="absolute -rotate-30 top-[10%] left-[10%] text-2xl font-semibold font-serif text-slate-900 dark:text-white whitespace-nowrap">NYIMIN © 2026</div>
      <div className="absolute -rotate-30 top-[40%] left-[10%] text-2xl font-semibold font-serif text-slate-900 dark:text-white whitespace-nowrap">NYIMIN © 2026</div>
      <div className="absolute -rotate-30 top-[70%] left-[10%] text-2xl font-semibold font-serif text-slate-900 dark:text-white whitespace-nowrap">NYIMIN © 2026</div>
      <div className="absolute -rotate-30 top-[10%] left-[50%] text-2xl font-semibold font-serif text-slate-900 dark:text-white whitespace-nowrap">NYIMIN © 2026</div>
      <div className="absolute -rotate-30 top-[40%] left-[50%] text-2xl font-semibold font-serif text-slate-900 dark:text-white whitespace-nowrap">NYIMIN © 2026</div>
      <div className="absolute -rotate-30 top-[70%] left-[50%] text-2xl font-semibold font-serif text-slate-900 dark:text-white whitespace-nowrap">NYIMIN © 2026</div>
    </div>
  );
}
