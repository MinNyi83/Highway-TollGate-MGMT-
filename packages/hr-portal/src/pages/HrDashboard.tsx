import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Clock, Wallet, Award, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../api/client';

export default function HrDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['hr-dashboard'],
    queryFn: async () => { const r = await api.get('/hr/dashboard'); return r.data; },
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" /></div>;
  if (isError) return <div className="flex items-center gap-2 text-red-500 p-4"><AlertCircle /> Failed to load dashboard</div>;

  const stats = data?.stats || data || {};
  const recentHires = Array.isArray(data?.recentHires) ? data.recentHires : Array.isArray(data?.recent_hires) ? data.recent_hires : [];

  const cards = [
    { label: 'Total Employees', value: stats.totalEmployees || 0, icon: Users, color: 'from-purple-500 to-violet-600' },
    { label: 'Active Employees', value: stats.activeEmployees || 0, icon: UserCheck, color: 'from-emerald-500 to-green-600' },
    { label: 'Today Present', value: stats.todayAttendance?.present || 0, icon: Clock, color: 'from-blue-500 to-cyan-600' },
    { label: 'Pending Leave', value: stats.pendingLeaves || 0, icon: Wallet, color: 'from-amber-500 to-orange-600' },
    { label: 'Departments', value: stats.totalDepartments || 0, icon: Award, color: 'from-pink-500 to-rose-600' },
    { label: 'Trainings', value: stats.activeTrainings || 0, icon: BookOpen, color: 'from-indigo-500 to-blue-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-serif">HR Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Human Resources overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card p-5 group hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.label}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {recentHires.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-purple-500" /> Recent Hires</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Employee #</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Hire Date</th>
                </tr>
              </thead>
              <tbody>
                {recentHires.map((h: any) => (
                  <tr key={h.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 font-medium">{h.firstName} {h.lastName}</td>
                    <td className="py-3 text-slate-500">{h.employeeNumber}</td>
                    <td className="py-3">{h.department?.name || '-'}</td>
                    <td className="py-3 text-slate-500">{new Date(h.hireDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
