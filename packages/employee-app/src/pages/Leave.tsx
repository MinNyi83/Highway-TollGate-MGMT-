import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';

export default function Leave() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ type: 'ANNUAL', startDate: '', endDate: '', reason: '' });

  const { data: leaveData } = useQuery({
    queryKey: ['hr-leave'],
    queryFn: async () => { const r = await api.get('/hr/leave'); return r.data; },
  });

  const submitMut = useMutation({
    mutationFn: async () => { await api.post('/hr/leave', { ...form, employeeId: user?.employeeId }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-leave'] }); setShowForm(false); setForm({ type: 'ANNUAL', startDate: '', endDate: '', reason: '' }); },
  });

  const requests = Array.isArray(leaveData?.leaves) ? leaveData.leaves : Array.isArray(leaveData) ? leaveData : Array.isArray(leaveData?.data) ? leaveData.data : [];

  const statusIcon = (s: string) => {
    if (s === 'APPROVED') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (s === 'REJECTED') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-amber-500" />;
  };

  return (
    <div className="space-y-5 pb-24 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Leave Requests</h1>
        <button onClick={() => setShowForm(!showForm)} className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showForm && (
        <div className="card p-4 space-y-3">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
            <option value="ANNUAL">Annual Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="PERSONAL">Personal</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input text-sm" />
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input text-sm" />
          </div>
          <textarea placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="input min-h-[80px] resize-none" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium">Cancel</button>
            <button onClick={() => submitMut.mutate()} disabled={submitMut.isPending}
              className="flex-1 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-bold disabled:opacity-50">
              {submitMut.isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card p-8 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No leave requests yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((l: any, i: number) => (
            <div key={l.id || i} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold">{l.type} Leave</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">{l.status}</span>
                </div>
                {statusIcon(l.status)}
              </div>
              <div className="text-xs text-slate-500">
                {l.startDate && format(new Date(l.startDate), 'MMM d')} – {l.endDate && format(new Date(l.endDate), 'MMM d, yyyy')}
              </div>
              {l.reason && <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{l.reason}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
