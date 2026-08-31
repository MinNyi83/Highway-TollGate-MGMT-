import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import { useAuthStore } from '../stores/authStore';
import { LogOut, PanelLeftClose, PanelLeftOpen, Sun, Moon, Presentation } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // default to sleek dark mode for Command Hub
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 h-14 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-200 shadow-sm">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Open Dahua-Style Project Presentation"
            >
              <Presentation size={15} />
              <span className="hidden sm:inline">Presentation</span>
            </a>

            <NotificationPanel />

            <button
              onClick={() => setDark(!dark)}
              className="p-2 text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">{user?.role || 'VIEWER'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-crimson-600 dark:hover:text-crimson-400 hover:bg-crimson-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-100/60 dark:bg-slate-950 p-6 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
