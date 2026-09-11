import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';
import { useLanguage } from '../i18n';

export default function TaxWithholding() {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 12);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['tax-withholding', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await api.get(`/financial/tax-withholding?${params.toString()}`);
      return res.data;
    },
  });

  const taxSummary = data?.taxSummary ?? [];

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Receipt className="w-6 h-6 text-rose-600" />
          {t('page.taxWithholding')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tax calculations and reporting</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(data?.totalRevenue || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Tax</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{formatMMK(data?.totalTax || 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {taxSummary.map((t: any) => (
          <div key={t.type} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="text-sm text-slate-500">{t.type}</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{formatMMK(t.amount)}</div>
            <div className="text-xs text-slate-400 mt-1">Rate: {(t.rate * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Tax Breakdown</h3>
        </div>
        <div className="p-6">
          {taxSummary.map((t: any) => (
            <div key={t.type} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600 dark:text-slate-300">{t.type}</span>
                <span className="font-medium text-rose-600">{formatMMK(t.amount)}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                <div className="bg-rose-600 h-3 rounded-full" style={{ width: `${(t.amount / (data?.totalTax || 1)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
