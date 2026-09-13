import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, PlayCircle, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/client';

export default function Payroll() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-payroll', month],
    queryFn: async () => { const r = await api.get(`/hr/payroll?month=${month}`); return r.data; },
  });

  const generateMut = useMutation({
    mutationFn: async () => { await api.post('/hr/payroll/generate', { month }); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-payroll'] }),
  });

  const processMut = useMutation({
    mutationFn: async (id: string) => { await api.put(`/hr/payroll/${id}/process`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-payroll'] }),
  });

  const payMut = useMutation({
    mutationFn: async (id: string) => { await api.put(`/hr/payroll/${id}/pay`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-payroll'] }),
  });

  const payrolls = data?.payrolls || data || [];

  const statusColor = (s: string) => {
    switch (s) {
      case 'PAID': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PROCESSED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DRAFT': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Payroll</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Process and manage employee payroll</p>
        </div>
        <div className="flex gap-2">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" />
          <button onClick={() => generateMut.mutate()} disabled={generateMut.isPending} className="btn-primary flex items-center gap-2">
            <PlayCircle size={16} /> {generateMut.isPending ? 'Generating...' : 'Generate Payroll'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/50">
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Base Salary</th>
                  <th className="px-4 py-3 font-medium">Overtime</th>
                  <th className="px-4 py-3 font-medium">Deductions</th>
                  <th className="px-4 py-3 font-medium">Net Pay</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-4 py-3 font-medium">{p.employee?.firstName} {p.employee?.lastName}</td>
                    <td className="px-4 py-3 text-slate-500">${p.baseSalary?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-500">+${p.overtimePay?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3 text-red-500">-${p.deductions?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3 font-semibold">${p.netPay?.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`badge ${statusColor(p.status)}`}>{p.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.status === 'DRAFT' && <button onClick={() => processMut.mutate(p.id)} className="btn-secondary text-xs px-2 py-1">Process</button>}
                        {p.status === 'PROCESSED' && <button onClick={() => payMut.mutate(p.id)} className="btn-primary text-xs px-2 py-1">Pay</button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {payrolls.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No payroll records for this month</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
