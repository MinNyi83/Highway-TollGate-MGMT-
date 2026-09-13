import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, Phone, Calendar, Building2, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: emp, isLoading } = useQuery({
    queryKey: ['hr-employee', id],
    queryFn: async () => { const r = await api.get(`/hr/employees/${id}`); return r.data; },
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>;
  if (!emp) return <div className="text-center py-12 text-slate-400">Employee not found</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-slate-500 hover:text-purple-500 transition-colors text-sm">
        <ArrowLeft size={16} /> Back to Employees
      </button>

      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {emp.firstName?.[0]}{emp.lastName?.[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-serif">{emp.firstName} {emp.lastName}</h1>
            <p className="text-sm text-slate-500">{emp.employeeNumber} · {emp.department?.name || 'No Department'}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Mail size={14} /> {emp.email}</span>
              {emp.phone && <span className="flex items-center gap-1"><Phone size={14} /> {emp.phone}</span>}
              <span className="flex items-center gap-1"><Calendar size={14} /> Hired {new Date(emp.hireDate).toLocaleDateString()}</span>
              {emp.salary && <span className="flex items-center gap-1"><Wallet size={14} /> ${emp.salary.toLocaleString()}</span>}
            </div>
          </div>
          <span className={`badge ${emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{emp.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Position Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Position</span><span className="font-medium">{emp.position?.title || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-medium">{emp.department?.name || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Employment Type</span><span className="font-medium">{emp.employmentType || 'FULL_TIME'}</span></div>
          </div>
        </div>
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Personal Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Date of Birth</span><span className="font-medium">{emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Gender</span><span className="font-medium">{emp.gender || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-medium text-right max-w-[200px] truncate">{emp.address || '-'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
