import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Building2, Users, ChevronDown, ChevronRight, X } from 'lucide-react';
import api from '../lib/api';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

interface Department {
  id: string;
  name: string;
  code: string;
  type: string;
  status: string;
  _count?: { employees: number };
  employees?: Array<{ id: string; firstName: string; lastName: string; position?: { title: string } }>;
}

const deptTypes = ['OPERATIONS', 'ADMINISTRATION', 'FINANCE', 'HR', 'IT', 'MAINTENANCE', 'SECURITY', 'OTHER'];

export default function Departments() {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: departments, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-departments'],
    queryFn: async () => {
      const res = await api.get('/hr/departments');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/hr/departments', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-departments'] });
      setShowForm(false);
    },
  });

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
  };

  if (isLoading) return <div className="min-h-screen bg-gradient-command p-6"><TableSkeleton /></div>;
  if (isError) return <div className="min-h-screen bg-gradient-command p-6"><ErrorState message={error?.message} onRetry={refetch} /></div>;

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Departments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments?.map((dept: Department) => (
          <div key={dept.id} className="glass-card overflow-hidden">
            <button
              onClick={() => toggleExpand(dept.id)}
              className="w-full p-5 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Building2 className="text-purple-400" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold truncate">{dept.name}</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-gray-300 font-mono">{dept.code}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><Users size={12} /> {dept._count?.employees || 0} employees</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/80">{dept.type}</span>
                </div>
              </div>
              {expandedId === dept.id ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
            </button>
            {expandedId === dept.id && dept.employees && dept.employees.length > 0 && (
              <div className="border-t border-white/10 p-4 bg-slate-800/30">
                <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Employees</p>
                <div className="space-y-2">
                  {dept.employees.map((emp) => (
                    <div key={emp.id} className="flex items-center justify-between text-sm">
                      <span className="text-white">{emp.firstName} {emp.lastName}</span>
                      <span className="text-gray-400">{emp.position?.title || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {departments?.length === 0 && (
        <div className="glass-card p-8 text-center text-gray-500">No departments found</div>
      )}

      {showForm && (
        <DepartmentForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}

function DepartmentForm({ onClose, onSubmit, isPending }: { onClose: () => void; onSubmit: (data: any) => void; isPending: boolean }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('OPERATIONS');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, code, type, status: 'ACTIVE' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl w-full max-w-md p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Department</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Operations"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="e.g. OPS"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {deptTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-600 rounded-lg text-gray-300 hover:bg-slate-800 font-medium">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50">
              {isPending ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
