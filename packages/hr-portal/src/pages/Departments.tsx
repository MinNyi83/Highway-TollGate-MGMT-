import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Users, X } from 'lucide-react';
import api from '../api/client';

export default function Departments() {
  const [showAdd, setShowAdd] = useState(false);
  const [editDept, setEditDept] = useState<any>(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-departments'],
    queryFn: async () => { const r = await api.get('/hr/departments'); return r.data; },
  });

  const createMut = useMutation({
    mutationFn: async () => { await api.post('/hr/departments', form); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-departments'] }); setShowAdd(false); setForm({ name: '', code: '', description: '' }); },
  });

  const updateMut = useMutation({
    mutationFn: async () => { await api.put(`/hr/departments/${editDept.id}`, form); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-departments'] }); setEditDept(null); setForm({ name: '', code: '', description: '' }); },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/hr/departments/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-departments'] }),
  });

  const departments = Array.isArray(data?.departments) ? data.departments : Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  const openEdit = (dept: any) => { setEditDept(dept); setForm({ name: dept.name, code: dept.code, description: dept.description || '' }); };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Departments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Organizational departments</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Department</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept: any) => (
            <div key={dept.id} className="glass-card p-5 group hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 flex items-center justify-center">
                  <Users size={20} className="text-purple-500" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(dept)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-400 hover:text-purple-500"><Edit size={14} /></button>
                  <button onClick={() => deleteMut.mutate(dept.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="font-semibold mt-3">{dept.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">{dept.code}</p>
              {dept.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{dept.description}</p>}
              {dept._count && (
                <div className="mt-3 text-xs text-slate-500">
                  {dept._count.employees || 0} employees
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {(showAdd || editDept) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAdd(false); setEditDept(null); }} />
          <div className="relative glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editDept ? 'Edit Department' : 'Add Department'}</h2>
              <button onClick={() => { setShowAdd(false); setEditDept(null); }} className="p-1 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium mb-1">Name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Code</label><input className="input-field" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Description</label><textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <button onClick={() => editDept ? updateMut.mutate() : createMut.mutate()} disabled={createMut.isPending || updateMut.isPending} className="btn-primary w-full">
                {editDept ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
