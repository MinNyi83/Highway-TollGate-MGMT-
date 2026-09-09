interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="input-field"
        />
      </div>
    </div>
  );
}
