import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Check, X, Clock, FileText } from 'lucide-react';
import api from '../api/client';

export default function LeaveRequests() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: '', leaveType: 'ANNUAL', startDate: '', endDate: '', reason: '' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-leave'],
    queryFn: async () => { const r = await api.get('/hr/leave'); return r.data; },
  });

  const createMut = useMutation({
    mutationFn: async () => { await api.post('/hr/leave', { ...form, days: 1 }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-leave'] }); setShowAdd(false); },
  });

  const approveMut = useMutation({
    mutationFn: async (id: string) => { await api.put(`/hr/leave/${id}/approve`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-leave'] }),
  });

  const rejectMut = useMutation({
    mutationFn: async (id: string) => { await api.put(`/hr/leave/${id}/reject`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-leave'] }),
  });

  const requests = data?.leaves || data || [];

  const statusColor = (s: string) => {
    switch (s) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Leave Requests</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage employee leave applications</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Request</button>
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
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Start</th>
                  <th className="px-4 py-3 font-medium">End</th>
                  <th className="px-4 py-3 font-medium">Days</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req: any) => (
                  <tr key={req.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-4 py-3 font-medium">{req.employee?.firstName} {req.employee?.lastName}</td>
                    <td className="px-4 py-3"><span className="badge bg-purple-50 text-purple-700 border-purple-200">{req.leaveType}</span></td>
                    <td className="px-4 py-3 text-slate-500">{new Date(req.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(req.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-500">{req.days}</td>
                    <td className="px-4 py-3"><span className={`badge ${statusColor(req.status)}`}>{req.status}</span></td>
                    <td className="px-4 py-3">
                      {req.status === 'PENDING' && (
                        <div className="flex gap-1">
                          <button onClick={() => approveMut.mutate(req.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500"><Check size={14} /></button>
                          <button onClick={() => rejectMut.mutate(req.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><X size={14} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No leave requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Leave Request</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium mb-1">Leave Type</label>
                <select className="input-field" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                  <option value="ANNUAL">Annual</option><option value="SICK">Sick</option><option value="MATERNITY">Maternity</option><option value="PATERNITY">Paternity</option><option value="EMERGENCY">Emergency</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1">Start Date</label><input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                <div><label className="block text-xs font-medium mb-1">End Date</label><input type="date" className="input-field" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1">Reason</label><textarea className="input-field" rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending} className="btn-primary w-full">
                {createMut.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
