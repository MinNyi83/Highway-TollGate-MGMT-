import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import CommandPalette from './CommandPalette';
import FloatingRail from './FloatingRail';
import Watermark from './Watermark';
import NotificationPanel from './NotificationPanel';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard, DollarSign, Car, MapPin, Activity, CreditCard,
  AlertTriangle, BarChart3, Users, Cpu, Settings, PlayCircle,
  Presentation, Shield, HeartPulse, Sun, Moon, Command, Radio,
} from 'lucide-react';

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Command Center', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/revenue-transfers', icon: DollarSign, label: 'Revenue Transfers', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/vehicles', icon: Car, label: 'Vehicles', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/toll-plazas', icon: MapPin, label: 'Toll Plazas', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/toll-events', icon: Activity, label: 'Toll Events', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/transactions', icon: CreditCard, label: 'Transactions', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/violations', icon: AlertTriangle, label: 'Violations', category: 'Navigation', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/customers', icon: Users, label: 'Customers', category: 'Navigation', roles: ['ADMIN'] },
  { to: '/devices', icon: Cpu, label: 'Devices', category: 'Navigation', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/device-status', icon: Settings, label: 'Device Status', category: 'Navigation', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/presentation', icon: Presentation, label: 'Presentation', category: 'Navigation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/simulator', icon: PlayCircle, label: 'Simulator', category: 'Navigation', roles: ['ADMIN'] },
  { to: '/audit-log', icon: Shield, label: 'Audit Log', category: 'Navigation', roles: ['ADMIN'] },
  { to: '/system-health', icon: HeartPulse, label: 'System Health', category: 'Navigation', roles: ['ADMIN'] },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const userRole = user?.role || 'VIEWER';
  const railItems = allNavItems
    .filter((item) => item.roles.includes(userRole))
    .map(({ roles, ...rest }) => rest);

  const cmdItems = allNavItems
    .filter((item) => item.roles.includes(userRole))
    .map((item) => ({ ...item, id: item.to, path: item.to }));

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Watermark />
      <FloatingRail items={railItems} logo="TG" logoIcon={Radio} onLogout={handleLogout} />

      <div className="md:ml-24 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-slate-200/40 dark:border-navy-600/30 h-14 flex items-center justify-between px-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-slate-400 dark:text-slate-500">
              <Radio size={18} className="text-gold-500" />
              <span className="font-serif font-semibold text-sm">TollGate</span>
              <span className="text-[10px] text-slate-400">Command Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-navy-700/50 border border-slate-200/60 dark:border-navy-600/30 text-slate-500 dark:text-slate-400 hover:border-gold-500/30 transition-all text-sm"
            >
              <Command size={14} />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-navy-800 rounded border border-slate-200 dark:border-navy-600">⌘K</kbd>
            </button>

            <NotificationPanel />

            <button
              onClick={() => setDark(!dark)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-gold-500 rounded-lg transition-colors"
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200/60 dark:border-navy-600/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{user?.role || 'VIEWER'}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto transition-colors duration-300">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette items={cmdItems} isOpen={cmdOpen} onClose={() => setCmdOpen(false)} placeholder="Search pages, actions..." />
    </div>
  );
}
