import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Eye, Edit, Trash2, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Employees() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', departmentId: '', positionId: '', hireDate: '', salary: '' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['hr-employees', search],
    queryFn: async () => { const r = await api.get(`/hr/employees?search=${search}&limit=50`); return r.data; },
  });

  const createMut = useMutation({
    mutationFn: async () => { await api.post('/hr/employees', { ...form, salary: form.salary ? parseFloat(form.salary) : undefined }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hr-employees'] }); setShowAdd(false); setForm({ firstName: '', lastName: '', email: '', phone: '', departmentId: '', positionId: '', hireDate: '', salary: '' }); },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/hr/employees/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hr-employees'] }),
  });

  const employees = data?.employees || data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Employees</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage employee records</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Employee</button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input type="text" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
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
                  <th className="px-4 py-3 font-medium">Number</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp: any) => (
                  <tr key={emp.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-navy-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">{emp.firstName?.[0]}{emp.lastName?.[0]}</div>
                        <div>
                          <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{emp.employeeNumber}</td>
                    <td className="px-4 py-3">{emp.department?.name || '-'}</td>
                    <td className="px-4 py-3">{emp.position?.title || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{emp.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/employees/${emp.id}`)} className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-slate-400 hover:text-purple-500 transition-colors"><Eye size={14} /></button>
                        <button onClick={() => deleteMut.mutate(emp.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No employees found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Employee</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-navy-700 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1">First Name</label><input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
                <div><label className="block text-xs font-medium mb-1">Last Name</label><input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
              </div>
              <div><label className="block text-xs font-medium mb-1">Email</label><input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="block text-xs font-medium mb-1">Phone</label><input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium mb-1">Hire Date</label><input type="date" className="input-field" value={form.hireDate} onChange={(e) => setForm({ ...form, hireDate: e.target.value })} /></div>
                <div><label className="block text-xs font-medium mb-1">Salary</label><input type="number" className="input-field" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></div>
              </div>
              <button onClick={() => createMut.mutate()} disabled={createMut.isPending} className="btn-primary w-full mt-2">
                {createMut.isPending ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
