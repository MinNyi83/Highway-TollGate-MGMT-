import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import { useAuthStore } from '../stores/authStore';
import { LogOut, PanelLeftClose, PanelLeftOpen, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
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
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col">
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/10 h-14 flex items-center justify-between px-6 sticky top-0 z-40">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>

          <div className="flex items-center gap-4">
            <NotificationPanel />

            <button
              onClick={() => setDark(!dark)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.role || 'VIEWER'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-crimson-400 hover:bg-crimson-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
