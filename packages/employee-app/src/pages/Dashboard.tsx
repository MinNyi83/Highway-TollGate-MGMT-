import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Home, Clock, Calendar, CreditCard, TrendingUp, Award, Bell, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: dashData } = useQuery({
    queryKey: ['hr-dashboard'],
    queryFn: async () => { const r = await api.get('/hr/dashboard'); return r.data; },
  });

  const { data: attendanceData } = useQuery({
    queryKey: ['hr-attendance-today', format(new Date(), 'yyyy-MM-dd')],
    queryFn: async () => { const r = await api.get(`/hr/attendance?date=${format(new Date(), 'yyyy-MM-dd')}`); return r.data; },
  });

  const dash = dashData?.stats || dashData || {};
  const records = Array.isArray(attendanceData?.records) ? attendanceData.records : Array.isArray(attendanceData) ? attendanceData : [];
  const todayRecord = records.find((r: any) => r.date?.startsWith(format(new Date(), 'yyyy-MM-dd')));

  const greetingTime = new Date().getHours();
  const greeting = greetingTime < 12 ? 'Good Morning' : greetingTime < 17 ? 'Good Afternoon' : 'Good Evening';

  const quickActions = [
    { to: '/attendance', icon: Clock, label: 'Clock In/Out', color: 'from-emerald-500 to-green-600' },
    { to: '/leave', icon: Calendar, label: 'Request Leave', color: 'from-violet-500 to-purple-600' },
    { to: '/payslips', icon: CreditCard, label: 'View Payslips', color: 'from-blue-500 to-indigo-600' },
  ];

  return (
    <div className="space-y-5 pb-24 animate-in">
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-violet-500/20">
        <div className="text-sm opacity-80">{greeting},</div>
        <div className="text-xl font-bold mt-0.5">{user?.name || 'Employee'}</div>
        <div className="text-xs opacity-60 mt-1">{format(new Date(), 'EEEE, MMMM d')}</div>

        {todayRecord && (
          <div className="mt-4 flex gap-3">
            <div className="bg-white/10 rounded-xl px-3 py-2 flex-1">
              <div className="text-[10px] opacity-60">Checked In</div>
              <div className="text-sm font-bold">{todayRecord.clockIn ? new Date(todayRecord.clockIn).toLocaleTimeString() : '--:--'}</div>
            </div>
            <div className="bg-white/10 rounded-xl px-3 py-2 flex-1">
              <div className="text-[10px] opacity-60">Status</div>
              <div className="text-sm font-bold">{todayRecord.status}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {quickActions.map(({ to, icon: Icon, label, color }) => (
          <NavLink key={to} to={to} className="card p-3 text-center active:scale-[0.97] transition-all">
            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl mx-auto flex items-center justify-center mb-2`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{label}</div>
          </NavLink>
        ))}
      </div>

      <div className="card divide-y divide-slate-100 dark:divide-slate-800">
        <div className="px-4 py-3 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-violet-500" />
          <div className="flex-1"><div className="text-xs text-slate-500">Total Employees</div><div className="text-lg font-bold">{dash.totalEmployees || dash.total_employees || '-'}</div></div>
        </div>
        <div className="px-4 py-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-emerald-500" />
          <div className="flex-1"><div className="text-xs text-slate-500">Present Today</div><div className="text-lg font-bold">{dash.presentToday || dash.present_today || '-'}</div></div>
        </div>
        <div className="px-4 py-3 flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-500" />
          <div className="flex-1"><div className="text-xs text-slate-500">Departments</div><div className="text-lg font-bold">{dash.totalDepartments || dash.total_departments || '-'}</div></div>
        </div>
      </div>
    </div>
  );
}
