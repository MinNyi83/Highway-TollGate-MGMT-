import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet, Play, CheckCircle, X } from 'lucide-react';
import api from '../lib/api';
import { TableSkeleton, CardSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  PROCESSED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PAID: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Payroll() {
  const [payPeriod, setPayPeriod] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);
  const [generatePeriod, setGeneratePeriod] = useState(new Date().toISOString().slice(0, 7));
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-payroll', payPeriod, statusFilter],
    queryFn: async () => {
      const res = await api.get('/hr/payroll', {
        params: { payPeriod, status: statusFilter },
      });
      return res.data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (period: string) => {
      const res = await api.post('/hr/payroll/generate', { payPeriod: period });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-payroll'] });
      setShowGenerate(false);
    },
  });

  const processMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/hr/payroll/${id}/process`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-payroll'] }),
  });

  const payMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/hr/payroll/${id}/pay`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-payroll'] }),
  });

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6 space-y-6"><CardSkeleton /><TableSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;

  const records = data?.items || [];
  const totalNetPay = records.reduce((sum: number, r: any) => sum + Number(r.netPay || 0), 0);
  const paidCount = records.filter((r: any) => r.status === 'PAID').length;
  const pendingCount = records.filter((r: any) => r.status === 'DRAFT' || r.status === 'PROCESSED').length;

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Payroll</h1>
        <button
          onClick={() => setShowGenerate(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Wallet size={16} /> Generate Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><Wallet className="text-blue-400" size={24} /></div>
            <div>
              <p className="text-sm text-gray-400">Total Net Pay</p>
              <p className="telemetry-value text-2xl text-white">K{totalNetPay.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><CheckCircle className="text-emerald-400" size={24} /></div>
            <div>
              <p className="text-sm text-gray-400">Paid</p>
              <p className="telemetry-value text-2xl text-emerald-400">{paidCount}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Play className="text-amber-400" size={24} /></div>
            <div>
              <p className="text-sm text-gray-400">Pending Processing</p>
              <p className="telemetry-value text-2xl text-amber-400">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="month"
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PROCESSED">Processed</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/60 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Base Salary</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Allowances</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Deductions</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overtime</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tax</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Pay</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.map((pay: any) => (
                <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    {pay.employee?.firstName} {pay.employee?.lastName}
                    <span className="block text-xs text-gray-400 font-mono">{pay.employee?.employeeNumber}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{pay.payPeriod}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">K{Number(pay.baseSalary).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">K{Number(pay.allowances || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">K{Number(pay.deductions || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">K{Number(pay.overtime || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">K{Number(pay.tax || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-white font-semibold">K{Number(pay.netPay).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[pay.status] || ''}`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {pay.status === 'DRAFT' && (
                        <button
                          onClick={() => processMutation.mutate(pay.id)}
                          disabled={processMutation.isPending}
                          className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-500 font-semibold disabled:opacity-50 flex items-center gap-1"
                        >
                          <Play size={12} /> Process
                        </button>
                      )}
                      {pay.status === 'PROCESSED' && (
                        <button
                          onClick={() => payMutation.mutate(pay.id)}
                          disabled={payMutation.isPending}
                          className="px-2.5 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-500 font-semibold disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-medium">No payroll records found</div>
        )}
      </div>

      {showGenerate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Generate Payroll</h2>
              <button onClick={() => setShowGenerate(false)} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-400 mb-4">Generate payroll for all active employees for the selected pay period.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Pay Period *</label>
              <input
                type="month"
                required
                value={generatePeriod}
                onChange={(e) => setGeneratePeriod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowGenerate(false)} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
              <button
                onClick={() => generateMutation.mutate(generatePeriod)}
                disabled={generateMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {generateMutation.isPending ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
