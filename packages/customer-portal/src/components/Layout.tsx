import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { CommandPalette, FloatingRail, Watermark } from '@tollgate/shared';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../hooks/useTheme';
import NotificationBell from './NotificationBell';
import ToastContainer from './Toast';
import {
  LayoutDashboard, History, AlertTriangle, Wallet, Car, Settings,
  Building2, Sun, Moon, Command, LogOut,
} from 'lucide-react';

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home', category: 'Navigation' },
  { to: '/my-vehicles', icon: Car, label: 'Vehicles', category: 'Navigation' },
  { to: '/toll-history', icon: History, label: 'History', category: 'Navigation' },
  { to: '/violations', icon: AlertTriangle, label: 'Violations', category: 'Navigation' },
  { to: '/account', icon: Wallet, label: 'Account', category: 'Navigation' },
  { to: '/fleet', icon: Building2, label: 'Fleet', category: 'Navigation', enterpriseOnly: true },
  { to: '/settings', icon: Settings, label: 'Settings', category: 'Navigation' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const isEnterprise = user?.customerType === 'ENTERPRISE';
  const filteredNavItems = allNavItems.filter((item) => !item.enterpriseOnly || isEnterprise);

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

  const railItems = filteredNavItems.map(({ enterpriseOnly, ...rest }) => rest);
  const cmdItems = filteredNavItems.map((item) => ({ ...item, id: item.to, path: item.to }));

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Watermark />
      <ToastContainer />

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-gray-200/40 dark:border-navy-600/30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Car className="text-gold-500" size={20} />
          <span className="font-bold font-serif text-sm">TollGate</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCmdOpen(true)} className="p-2 text-gray-500 dark:text-gray-400">
            <Command size={18} />
          </button>
          <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400">
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
          <NotificationBell />
        </div>
      </header>

      {/* Desktop Floating Rail */}
      <FloatingRail items={railItems} logo="TG" onLogout={handleLogout} />

      <div className="md:ml-24 flex flex-col min-h-screen">
        <header className="hidden md:flex sticky top-0 z-40 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-gray-200/40 dark:border-navy-600/30 h-14 items-center justify-between px-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <Car size={18} className="text-gold-500" />
            <span className="font-serif font-semibold text-sm">TollGate</span>
            <span className="text-[10px]">Customer Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-navy-700/50 border border-gray-200/60 dark:border-navy-600/30 text-gray-500 dark:text-gray-400 hover:border-gold-500/30 transition-all text-sm"
            >
              <Command size={14} />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-white dark:bg-navy-800 rounded border border-gray-200 dark:border-navy-600">⌘K</kbd>
            </button>
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gold-500 rounded-lg transition-colors">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
            <NotificationBell />
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200/60 dark:border-navy-600/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">{user?.name}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-crimson-500 rounded-lg transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-auto transition-colors duration-300">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-navy-800/90 backdrop-blur-xl border-t border-gray-200/40 dark:border-navy-600/30 px-2 py-1 flex justify-around items-center safe-area-bottom shadow-lg">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-gold-500 dark:text-gold-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <CommandPalette items={cmdItems} isOpen={cmdOpen} onClose={() => setCmdOpen(false)} placeholder="Search pages..." />
    </div>
  );
}
