import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Clock, Calendar } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';
import { useLanguage } from '../i18n';

function HeatmapCell({ value, max }: { value: number; max: number }) {
  const intensity = max > 0 ? value / max : 0;
  const bg = intensity === 0 ? 'bg-slate-100 dark:bg-slate-800'
    : intensity < 0.2 ? 'bg-blue-100 dark:bg-blue-900/30'
    : intensity < 0.4 ? 'bg-blue-200 dark:bg-blue-800/40'
    : intensity < 0.6 ? 'bg-blue-300 dark:bg-blue-700/50'
    : intensity < 0.8 ? 'bg-blue-400 dark:bg-blue-600/60'
    : 'bg-blue-600 dark:bg-blue-500/80';

  return (
    <div
      className={`w-10 h-10 rounded-md flex items-center justify-center text-[10px] font-medium ${bg} ${intensity > 0.5 ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}
      title={`${formatMMK(value)}`}
    >
      {value > 0 ? `${(value / 1000).toFixed(0)}k` : ''}
    </div>
  );
}

export default function RevenueHeatmap() {
  const { t } = useLanguage();
  const [days, setDays] = useState(30);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['heatmap', days],
    queryFn: async () => {
      const res = await api.get(`/financial/heatmap?days=${days}`);
      return res.data;
    },
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const maxRevenue = data?.heatmap?.reduce((max: number, day: any) => {
    return Math.max(max, ...day.hours.map((h: any) => h.revenue));
  }, 0) || 1;

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Grid className="w-6 h-6 text-indigo-600" />
          {t('page.revenueHeatmap')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Traffic patterns by hour and day of week</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Period:</label>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Clock className="w-4 h-4" /> Peak Hour</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{data?.peakHour ?? 0}:00</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="w-4 h-4" /> Peak Day</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{data?.peakDay || 'N/A'}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Events</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{data?.totalEvents?.toLocaleString() || 0}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Revenue by Hour & Day</h3>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-slate-500">Loading...</div>
        ) : (
          <div className="min-w-[800px]">
            <div className="flex gap-1 mb-2 ml-16">
              {hours.map(h => (
                <div key={h} className="w-10 text-center text-[10px] text-slate-400">{h}</div>
              ))}
            </div>
            {data?.heatmap?.map((day: any) => (
              <div key={day.day} className="flex items-center gap-1 mb-1">
                <div className="w-14 text-right text-xs font-medium text-slate-500 pr-2">{day.day}</div>
                {day.hours.map((h: any) => (
                  <HeatmapCell key={h.hour} value={h.revenue} max={maxRevenue} />
                ))}
              </div>
            ))}
            <div className="flex items-center gap-2 mt-4 ml-16">
              <span className="text-[10px] text-slate-400">Low</span>
              <div className="flex gap-1">
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((_, i) => (
                  <div key={i} className={`w-6 h-4 rounded ${i === 0 ? 'bg-slate-100' : i < 3 ? `bg-blue-${i + 1}00` : i < 5 ? `bg-blue-${(i - 1) * 100}` : 'bg-blue-600'}`} />
                ))}
              </div>
              <span className="text-[10px] text-slate-400">High</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
