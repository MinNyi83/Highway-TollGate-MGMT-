import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Award, Plus, Star, X } from 'lucide-react';
import api from '../api/client';

export default function Performance() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ employeeId: '', reviewPeriod: '', rating: 'AVERAGE', goals: '', strengths: '', improvements: '', comments: '' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-performance'],
    queryFn: async () => { const r = await api.get('/hr/performance'); return r.data; },
  });

  const createMut = useMutation({
    mutationFn: async () => { await api.post('/hr/performance', form); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-performance'] }); setShowAdd(false); },
  });

  const reviews = Array.isArray(data?.reviews) ? data.reviews : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  const ratingColor = (r: string) => {
    switch (r) {
      case 'EXCELLENT': return 'text-emerald-500';
      case 'GOOD': return 'text-blue-500';
      case 'AVERAGE': return 'text-amber-500';
      case 'BELOW_AVERAGE': return 'text-orange-500';
      case 'POOR': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Performance Reviews</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track employee performance</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Review</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev: any) => (
            <div key={rev.id} className="glass-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{rev.employee?.firstName} {rev.employee?.lastName}</h3>
                  <p className="text-xs text-slate-500 mt-1">Period: {rev.reviewPeriod}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className={ratingColor(rev.rating)} />
                  <span className={`text-sm font-semibold ${ratingColor(rev.rating)}`}>{rev.rating}</span>
                </div>
              </div>
              {rev.goals && <p className="text-sm text-slate-600 dark:text-slate-400 mt-3"><strong>Goals:</strong> {rev.goals}</p>}
              {rev.strengths && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><strong>Strengths:</strong> {rev.strengths}</p>}
              {rev.improvements && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><strong>Improvements:</strong> {rev.improvements}</p>}
            </div>
          ))}
          {reviews.length === 0 && <div className="glass-card p-12 text-center text-slate-400">No performance reviews yet</div>}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Performance Review</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium mb-1">Employee ID</label><input className="input-field" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Review Period</label><input className="input-field" value={form.reviewPeriod} onChange={(e) => setForm({ ...form, reviewPeriod: e.target.value })} placeholder="e.g. Q1 2026" /></div>
              <div><label className="block text-xs font-medium mb-1">Rating</label>
                <select className="input-field" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                  <option value="EXCELLENT">Excellent</option><option value="GOOD">Good</option><option value="AVERAGE">Average</option><option value="BELOW_AVERAGE">Below Average</option><option value="POOR">Poor</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium mb-1">Goals</label><textarea className="input-field" rows={2} value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Strengths</label><textarea className="input-field" rows={2} value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Areas for Improvement</label><textarea className="input-field" rows={2} value={form.improvements} onChange={(e) => setForm({ ...form, improvements: e.target.value })} /></div>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending} className="btn-primary w-full">
                {createMut.isPending ? 'Creating...' : 'Create Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
