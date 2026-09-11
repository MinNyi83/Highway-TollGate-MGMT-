import { useQuery } from '@tanstack/react-query';
import { Banknote } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';
import ErrorState from '../components/ErrorState';
import { useLanguage } from '../i18n';

export default function CashFlow() {
  const { t } = useLanguage();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['cash-flow'],
    queryFn: async () => {
      const res = await api.get('/financial/cash-flow');
      return res.data;
    },
  });

  const months = data?.months ?? [];
  const summary = data?.summary ?? {};

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Banknote className="w-6 h-6 text-emerald-600" />
          {t('page.cashFlow')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">12-month cash flow projections and analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="text-sm text-slate-500">Total Revenue</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMMK(summary.totalRevenue || 0)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-sm text-slate-500">Total Expenses</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{formatMMK(summary.totalExpenses || 0)}</div>
        </div>
        <div className="glass-card p-5">
          <div className="text-sm text-slate-500">Net Cash Flow</div>
          <div className={`text-2xl font-bold mt-1 ${(summary.netCashFlow || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatMMK(summary.netCashFlow || 0)}</div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Cash Flow</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Month</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Revenue</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Operating</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Debt Service</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">CapEx</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Net Cash Flow</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">Closing Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {months.map((m: any) => (
                <tr key={m.month} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{m.month}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{formatMMK(m.revenue)}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatMMK(m.operatingExpense)}</td>
                  <td className="px-4 py-3 text-right text-amber-600">{formatMMK(m.debtService)}</td>
                  <td className="px-4 py-3 text-right text-violet-600">{formatMMK(m.capitalExpenditure)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${m.netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatMMK(m.netCashFlow)}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-white">{formatMMK(m.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
