import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  hireDate: string;
  department?: { id: string; name: string };
  position?: { id: string; title: string };
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  ON_LEAVE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  TERMINATED: 'bg-red-500/20 text-red-400 border-red-500/30',
  INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function Employees() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-employees', search, status, departmentId, page],
    queryFn: async () => {
      const res = await api.get('/hr/employees', {
        params: { search, status, departmentId, page, limit },
      });
      return res.data;
    },
  });

  const { data: departments } = useQuery({
    queryKey: ['hr-departments-list'],
    queryFn: async () => {
      const res = await api.get('/hr/departments');
      return res.data;
    },
  });

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  const employees = data?.items || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Employees</h1>
        <Link
          to="/hr/employees/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Employee
        </Link>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="INACTIVE">Inactive</option>
            <option value="TERMINATED">Terminated</option>
          </select>
          <select
            value={departmentId}
            onChange={(e) => { setDepartmentId(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/60 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee #</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Position</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hire Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map((emp: Employee) => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300 font-mono">{emp.employeeNumber}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    <Link to={`/hr/employees/${emp.id}`} className="hover:text-cyan-400 transition-colors">
                      {emp.firstName} {emp.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{emp.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{emp.department?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{emp.position?.title || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[emp.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(emp.hireDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {employees.length === 0 && (
          <div className="p-8 text-center text-gray-500 font-medium">No employees found</div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} employees
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm disabled:opacity-50 hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm disabled:opacity-50 hover:bg-slate-700 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
