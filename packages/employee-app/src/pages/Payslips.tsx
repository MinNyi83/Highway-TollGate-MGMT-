import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Download, DollarSign, Calendar } from 'lucide-react';
import api from '../api/client';
import { format } from 'date-fns';

export default function Payslips() {
  const { data: payrollData } = useQuery({
    queryKey: ['hr-payroll'],
    queryFn: async () => { const r = await api.get('/hr/payroll'); return r.data; },
  });

  const payrolls = Array.isArray(payrollData?.payrolls) ? payrollData.payrolls : Array.isArray(payrollData) ? payrollData : Array.isArray(payrollData?.data) ? payrollData.data : [];

  return (
    <div className="space-y-5 pb-24 animate-in">
      <h1 className="text-xl font-bold px-1">Payslips</h1>

      {payrolls.length === 0 ? (
        <div className="card p-8 text-center">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No payslip records yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payrolls.map((p: any, i: number) => (
            <div key={p.id || i} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-semibold">{p.period || p.month || format(new Date(), 'MMMM yyyy')}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {p.status || 'PENDING'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-navy-950 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-0.5">Gross</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">${p.grossSalary?.toLocaleString() || p.gross?.toLocaleString() || '0'}</div>
                </div>
                <div className="bg-slate-50 dark:bg-navy-950 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-0.5">Net Pay</div>
                  <div className="text-sm font-bold text-emerald-600">${p.netSalary?.toLocaleString() || p.net?.toLocaleString() || '0'}</div>
                </div>
              </div>

              {(p.deductions !== undefined || p.deduction !== undefined) && (
                <div className="mt-2 text-xs text-slate-500 text-right">
                  Deductions: ${(p.deductions || p.deduction || 0).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
