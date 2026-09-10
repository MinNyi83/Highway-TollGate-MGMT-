import { useQuery } from '@tanstack/react-query';
import { Landmark } from 'lucide-react';
import api from '../api/client';
import { formatMMK } from '../utils/format';

export default function DebtManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ['debt-management'],
    queryFn: async () => {
      const res = await api.get('/financial/debt-management');
      return res.data;
    },
  });

  const debts = data?.debts ?? [];
  const summary = data?.summary ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Landmark className="w-6 h-6 text-amber-600" />
          Debt Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Loans, interest, and repayment schedules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Principal</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{formatMMK(summary.totalPrincipal || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Monthly Payment</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{formatMMK(summary.totalMonthlyPayment || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Total Interest</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{formatMMK(summary.totalInterestCost || 0)}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="text-sm text-slate-500">Remaining Debt</div>
          <div className="text-2xl font-bold text-violet-600 mt-1">{formatMMK(summary.totalRemainingDebt || 0)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Active Debts</h3>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {debts.map((debt: any) => (
              <div key={debt.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{debt.name}</h4>
                    <span className="text-xs text-slate-500">{debt.id} · {debt.type}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Active</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500">Principal</div>
                    <div className="font-medium text-slate-800 dark:text-white">{formatMMK(debt.principal)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Interest Rate</div>
                    <div className="font-medium text-slate-800 dark:text-white">{(debt.interestRate * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Monthly Payment</div>
                    <div className="font-medium text-blue-600">{formatMMK(debt.monthlyPayment)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Remaining Months</div>
                    <div className="font-medium text-slate-800 dark:text-white">{debt.remainingMonths}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Progress</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${((debt.term - debt.remainingMonths) / debt.term) * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{((debt.term - debt.remainingMonths) / debt.term * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
