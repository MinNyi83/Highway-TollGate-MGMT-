import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import CommandPalette from './CommandPalette';
import Sidebar from './Sidebar';
import Watermark from './Watermark';
import NotificationPanel from './NotificationPanel';
import ThemePicker from './ThemePicker';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard, DollarSign, Car, MapPin, Activity, CreditCard,
  AlertTriangle, BarChart3, Users, Cpu, Settings, PlayCircle,
  Presentation, Shield, HeartPulse, Sun, Moon, Command, Radio, Menu, X,
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

const mobileTabItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/vehicles', icon: Car, label: 'Vehicles' },
  { to: '/toll-events', icon: Activity, label: 'Events' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const filteredItems = allNavItems.filter((item) => userRole === 'SUPER_ADMIN' || item.roles.includes(userRole));
  const railItems = filteredItems.map(({ roles, ...rest }) => rest);

  const cmdItems = filteredItems.map((item) => ({
    ...item,
    id: item.to,
    path: item.to,
  }));

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Watermark />
      <Sidebar items={railItems} logo="TG" logoIcon={Radio} onLogout={handleLogout} />

      <div className="md:ml-14 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 md:px-6 transition-all duration-300 bg-white/80 dark:bg-[var(--surface)]/80 backdrop-blur-xl border-b-2 border-[var(--accent-border)] shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-[var(--accent)] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-sm">
                <Radio size={14} className="text-white" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm text-[var(--accent-text)]">TollGate</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1.5">Command Hub</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-[var(--accent-border)] hover:text-[var(--accent-text)] transition-all text-sm"
            >
              <Command size={14} />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-navy-800 rounded border border-slate-200 dark:border-navy-600 text-slate-400">⌘K</kbd>
            </button>

            <NotificationPanel />

            <ThemePicker />

            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-[var(--accent)] rounded-lg transition-colors"
              title={darkMode === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {darkMode === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200/60 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{user?.role || 'VIEWER'}</p>
              </div>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-14 z-30 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl overflow-y-auto">
            <nav className="p-4 space-y-1">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[var(--accent-bg)] text-[var(--accent-text)]'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
              <div className="border-t border-slate-200/40 dark:border-white/10 my-3" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-crimson-500 hover:bg-crimson-500/10 w-full transition-all"
              >
                Logout
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto transition-colors duration-300">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-navy-800/90 backdrop-blur-xl border-t border-slate-200/40 dark:border-white/10 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {mobileTabItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'text-[var(--accent-text)]'
                      : 'text-slate-400 dark:text-slate-500'
                  }`
                }
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <CommandPalette items={cmdItems} isOpen={cmdOpen} onClose={() => setCmdOpen(false)} placeholder="Search pages, actions..." />
    </div>
  );
}
