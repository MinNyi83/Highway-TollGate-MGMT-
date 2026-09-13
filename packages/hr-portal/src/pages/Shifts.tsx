import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CalendarDays, Edit, Trash2, X } from 'lucide-react';
import api from '../api/client';

export default function Shifts() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', startTime: '08:00', endTime: '17:00', breakMinutes: '60' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-shifts'],
    queryFn: async () => { const r = await api.get('/hr/shifts'); return r.data; },
  });

  const createMut = useMutation({
    mutationFn: async () => { await api.post('/hr/shifts', { ...form, breakMinutes: parseInt(form.breakMinutes) }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-shifts'] }); setShowAdd(false); setForm({ name: '', startTime: '08:00', endTime: '17:00', breakMinutes: '60' }); },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/hr/shifts/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-shifts'] }),
  });

  const shifts = Array.isArray(data?.shifts) ? data.shifts : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Shifts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage work shifts</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Shift</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shifts.map((shift: any) => (
            <div key={shift.id} className="glass-card p-5 group hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                  <CalendarDays size={20} className="text-blue-500" />
                </div>
                <button onClick={() => deleteMut.mutate(shift.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
              </div>
              <h3 className="font-semibold mt-3">{shift.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-slate-500">
                <p>{shift.startTime} - {shift.endTime}</p>
                <p>{shift.breakMinutes || 60} min break</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Shift</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium mb-1">Shift Name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Morning Shift" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1">Start Time</label><input type="time" className="input-field" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div>
                <div><label className="block text-xs font-medium mb-1">End Time</label><input type="time" className="input-field" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1">Break (minutes)</label><input type="number" className="input-field" value={form.breakMinutes} onChange={(e) => setForm({ ...form, breakMinutes: e.target.value })} /></div>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending} className="btn-primary w-full">
                {createMut.isPending ? 'Creating...' : 'Create Shift'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
