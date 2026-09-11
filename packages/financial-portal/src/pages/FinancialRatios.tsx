import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import api from '../api/client';
import DateRangePicker from '../components/DateRangePicker';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';
import { useLanguage } from '../i18n';

export default function FinancialRatios() {
  const { t } = useLanguage();
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 12);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['financial-ratios', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await api.get(`/financial/financial-ratios?${params.toString()}`);
      return res.data;
    },
  });

  const ratios = data?.ratios ?? {};

  const ratioCards = [
    { label: 'Net Profit Margin', value: ratios.profitability?.netProfitMargin, suffix: '%', color: 'text-emerald-600', category: 'Profitability' },
    { label: 'Return on Assets', value: ratios.profitability?.returnOnAssets, suffix: '%', color: 'text-blue-600', category: 'Profitability' },
    { label: 'Return on Equity', value: ratios.profitability?.returnOnEquity, suffix: '%', color: 'text-violet-600', category: 'Profitability' },
    { label: 'Current Ratio', value: ratios.liquidity?.currentRatio, suffix: 'x', color: 'text-amber-600', category: 'Liquidity' },
    { label: 'Quick Ratio', value: ratios.liquidity?.quickRatio, suffix: 'x', color: 'text-orange-600', category: 'Liquidity' },
    { label: 'Asset Turnover', value: ratios.efficiency?.assetTurnover, suffix: 'x', color: 'text-indigo-600', category: 'Efficiency' },
  ];

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600" />
          {t('page.financialRatios')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Profitability, liquidity, and efficiency metrics</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(data?.revenue || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Expenses</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{formatMMK(data?.expenses || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Net Income</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{formatMMK(data?.netIncome || 0)}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Profitability', 'Liquidity', 'Efficiency'].map(category => (
            <div key={category} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{category}</h3>
              </div>
              <div className="p-6 space-y-4">
                {ratioCards.filter(r => r.category === category).map(r => (
                  <div key={r.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-300">{r.label}</span>
                      <span className={`font-bold ${r.color}`}>{(r.value || 0).toFixed(2)}{r.suffix}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.min((r.value || 0) * (r.suffix === 'x' ? 30 : 2), 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
