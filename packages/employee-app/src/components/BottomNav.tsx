import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, User, Clock, Calendar, CreditCard, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/attendance', icon: Clock, label: 'Clock' },
  { to: '/leave', icon: Calendar, label: 'Leave' },
  { to: '/payslips', icon: CreditCard, label: 'Pay' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  if (location.pathname === '/login') return null;

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <NavLink key={to} to={to} className="flex flex-col items-center gap-0.5 py-2 px-3">
              <Icon className={`w-5 h-5 ${active ? 'text-violet-500' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-medium ${active ? 'text-violet-500' : 'text-slate-400'}`}>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
