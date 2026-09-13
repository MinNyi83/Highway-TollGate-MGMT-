import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, Building2, CalendarOff, Clock, Plus, FileText, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { DashboardSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280', '#8b5cf6', '#06b6d4'];

export default function HrDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['hr-dashboard'],
    queryFn: async () => {
      const res = await api.get('/hr/dashboard');
      return res.data;
    },
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  const stats = [
    { label: 'Total Employees', value: data?.totalEmployees || 0, icon: Users, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Active Employees', value: data?.activeEmployees || 0, icon: UserCheck, color: 'bg-emerald-500/20 text-emerald-400' },
    { label: 'Departments', value: data?.departments || 0, icon: Building2, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Pending Leaves', value: data?.pendingLeaves || 0, icon: CalendarOff, color: 'bg-amber-500/20 text-amber-400' },
    { label: "Today's Attendance", value: data?.attendanceToday || 0, icon: Clock, color: 'bg-cyan-500/20 text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-command p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">HR Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/hr/employees" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Add Employee
          </Link>
          <Link to="/hr/leave" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <FileText size={16} /> Leave Requests
          </Link>
          <Link to="/hr/payroll" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Wallet size={16} /> Payroll
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{s.label}</p>
                <p className="telemetry-value text-2xl text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Employee Status Breakdown</h3>
          {data?.statusCounts?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.statusCounts}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {data.statusCounts.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(11, 15, 23, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">No data</div>
          )}
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Department Distribution</h3>
          {data?.deptCounts?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.deptCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(11, 15, 23, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Bar dataKey="count" name="Employees" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">No data</div>
          )}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Hires</h3>
        {data?.recentHires?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Employee #</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Department</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Position</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Hire Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentHires.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">{emp.employeeNumber}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      <Link to={`/hr/employees/${emp.id}`} className="hover:text-cyan-400 transition-colors">
                        {emp.firstName} {emp.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{emp.department?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{emp.position?.title || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(emp.hireDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No recent hires</div>
        )}
      </div>
    </div>
  );
}
