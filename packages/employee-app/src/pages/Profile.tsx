import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, Building2, Briefcase, CalendarDays, LogOut } from 'lucide-react';
import api from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: profileData } = useQuery({
    queryKey: ['hr-profile', user?.employeeId],
    queryFn: async () => {
      if (!user?.employeeId) {
        const empRes = await api.get(`/hr/employees?search=${user?.email}&limit=1`);
        const empArr = Array.isArray(empRes.data?.employees) ? empRes.data.employees : Array.isArray(empRes.data) ? empRes.data : [];
        if (empArr.length > 0) return empArr[0];
        return null;
      }
      const r = await api.get(`/hr/employees/${user.employeeId}`);
      return r.data?.employee || r.data;
    },
    enabled: true,
  });

  const profile = profileData?.employee || profileData;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="space-y-5 pb-24 animate-in">
      <h1 className="text-xl font-bold px-1">Profile</h1>

      <div className="card p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg shadow-violet-500/20">
          <span className="text-2xl font-bold text-white">{(profile?.firstName || profile?.name || user?.name || '?')[0]}</span>
        </div>
        <h2 className="text-lg font-bold">{profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : profile?.name || user?.name}</h2>
        <p className="text-sm text-slate-500">{profile?.position?.title || profile?.position || user?.role}</p>
      </div>

      <div className="card divide-y divide-slate-100 dark:divide-slate-800">
        <ProfileRow icon={Mail} label="Email" value={profile?.email || user?.email} />
        <ProfileRow icon={Phone} label="Phone" value={profile?.phone || 'Not set'} />
        <ProfileRow icon={Building2} label="Department" value={profile?.department?.name || profile?.department || 'N/A'} />
        <ProfileRow icon={Briefcase} label="Position" value={profile?.position?.title || profile?.position || 'N/A'} />
        <ProfileRow icon={CalendarDays} label="Hire Date" value={profile?.hireDate ? format(new Date(profile.hireDate), 'MMM d, yyyy') : 'N/A'} />
      </div>

      <button onClick={handleLogout}
        className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-all">
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon className="w-4 h-4 text-slate-400" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}
