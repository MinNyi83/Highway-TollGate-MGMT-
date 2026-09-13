import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, BookOpen, CheckCircle, Users, X } from 'lucide-react';
import api from '../api/client';

export default function Training() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', trainer: '', startDate: '', endDate: '', maxParticipants: '20' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-training'],
    queryFn: async () => { const r = await api.get('/hr/training'); return r.data; },
  });

  const createMut = useMutation({
    mutationFn: async () => { await api.post('/hr/training', { ...form, maxParticipants: parseInt(form.maxParticipants) }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-training'] }); setShowAdd(false); },
  });

  const completeMut = useMutation({
    mutationFn: async (id: string) => { await api.put(`/hr/training/${id}/complete`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-training'] }),
  });

  const trainings = Array.isArray(data?.trainings) ? data.trainings : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Training Programs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage training and development</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Program</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings.map((t: any) => (
            <div key={t.id} className="glass-card p-5 group hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 flex items-center justify-center">
                  <BookOpen size={20} className="text-indigo-500" />
                </div>
                {t.status !== 'COMPLETED' && (
                  <button onClick={() => completeMut.mutate(t.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500 transition-all"><CheckCircle size={14} /></button>
                )}
              </div>
              <h3 className="font-semibold mt-3">{t.title}</h3>
              {t.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>}
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                {t.trainer && <p>Trainer: {t.trainer}</p>}
                <p>{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</p>
                <div className="flex items-center gap-1"><Users size={12} /> {t._count?.enrollments || 0}/{t.maxParticipants} enrolled</div>
              </div>
              <span className={`mt-3 badge ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : t.status === 'ONGOING' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{t.status}</span>
            </div>
          ))}
          {trainings.length === 0 && <div className="glass-card p-12 text-center text-slate-400 col-span-full">No training programs</div>}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Training Program</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium mb-1">Title</label><input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Trainer</label><input className="input-field" value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs font-medium mb-1">Start</label><input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                <div><label className="block text-xs font-medium mb-1">End</label><input type="date" className="input-field" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
                <div><label className="block text-xs font-medium mb-1">Max</label><input type="number" className="input-field" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} /></div>
              </div>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending} className="btn-primary w-full">
                {createMut.isPending ? 'Creating...' : 'Create Program'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
