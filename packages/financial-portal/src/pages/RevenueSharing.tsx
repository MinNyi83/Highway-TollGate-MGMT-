import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Share2 } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';
import { useLanguage } from '../i18n';

export default function RevenueSharing() {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 12);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['revenue-sharing', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await api.get(`/financial/revenue-sharing?${params.toString()}`);
      return res.data;
    },
  });

  const partners = data?.partners ?? [];
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Share2 className="w-6 h-6 text-green-600" />
          {t('page.revenueSharing')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Revenue distribution to partners and stakeholders</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="text-sm text-slate-500 mb-1">Total Revenue</div>
        <div className="text-3xl font-bold text-emerald-600">{formatMMK(data?.totalRevenue || 0)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {partners.map((p: any, i: number) => (
          <div key={p.name} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="text-xs font-medium text-slate-500 mb-1">{p.name}</div>
            <div className="text-xl font-bold" style={{ color: colors[i % colors.length] }}>{formatMMK(p.amount)}</div>
            <div className="text-xs text-slate-400 mt-1">{(p.share * 100).toFixed(0)}% share</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Distribution Details</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Stakeholder</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Share %</th>
              <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {partners.map((p: any, i: number) => (
              <tr key={p.name} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{p.name}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{(p.share * 100).toFixed(0)}%</td>
                <td className="px-4 py-3 text-right font-medium" style={{ color: colors[i % colors.length] }}>{formatMMK(p.amount)}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Pending</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
