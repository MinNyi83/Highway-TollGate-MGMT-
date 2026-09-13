import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import {
  LayoutDashboard, Users, Building2, Clock, CalendarDays,
  FileText, Wallet, Award, BookOpen, Sun, Moon, Menu, X, LogOut, UserCheck
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeContext } from '../contexts/ThemeContext';
import Watermark from './Watermark';

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/departments', icon: Building2, label: 'Departments' },
  { to: '/attendance', icon: Clock, label: 'Attendance' },
  { to: '/shifts', icon: CalendarDays, label: 'Shifts' },
  { to: '/leave', icon: FileText, label: 'Leave Requests' },
  { to: '/payroll', icon: Wallet, label: 'Payroll' },
  { to: '/performance', icon: Award, label: 'Performance' },
  { to: '/training', icon: BookOpen, label: 'Training' },
];

const mobileTabItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/employees', icon: Users, label: 'Staff' },
  { to: '/attendance', icon: Clock, label: 'Attend' },
  { to: '/leave', icon: FileText, label: 'Leave' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Watermark />

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-50 hidden md:flex flex-col h-screen transition-all duration-300 w-14 lg:w-64 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 border-r border-navy-700/40 shadow-xl shadow-navy-950/30">
        <div className="p-3 lg:p-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              <Users size={20} className="text-white" />
            </div>
            <div className="hidden lg:block overflow-hidden">
              <h1 className="font-bold font-serif text-base text-white leading-tight tracking-wide">TollGate</h1>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase">HR Portal</p>
            </div>
          </div>
        </div>

        {user && (
          <div className="hidden lg:block mx-3 mb-3 p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0 shadow-md">
                <span className="text-xs font-bold text-white">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 lg:px-3 space-y-1 custom-scrollbar scrollbar-thin">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-purple-500/10 text-purple-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  } justify-center lg:justify-start px-2 lg:px-3 py-2.5`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-purple-500 rounded-r-full shadow-[0_0_8px_#8b5cf6]" />
                    )}
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-200 ${isActive ? 'bg-purple-500/15 shadow-sm' : 'group-hover:bg-white/5'}`}>
                      <Icon size={18} className={`transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                      {isActive && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_6px_#8b5cf6]" />}
                    </div>
                    <span className={`hidden lg:block truncate ml-3 transition-all duration-200 ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                    <div className="lg:hidden fixed left-[4.5rem] z-[9999] pointer-events-none opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200 ease-out">
                      <div className="flex items-center gap-2 px-3 py-2 bg-navy-700/95 backdrop-blur-xl text-white text-xs font-medium rounded-xl shadow-xl border border-navy-600/50 whitespace-nowrap">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_#8b5cf6]" />
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-navy-700/95 rotate-45 border-l border-b border-navy-600/50" />
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-navy-700/40">
          <div className="p-2 lg:p-3 space-y-1">
            <button onClick={toggleDarkMode} className="group w-full flex items-center rounded-xl text-sm font-medium text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all justify-center lg:justify-start px-2 lg:px-3 py-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 group-hover:bg-yellow-500/10 transition-all">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              <span className="hidden lg:block ml-3">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button onClick={handleLogout} className="group w-full flex items-center rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all justify-center lg:justify-start px-2 lg:px-3 py-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 group-hover:bg-red-500/10 transition-all">
                <LogOut size={18} />
              </div>
              <span className="hidden lg:block ml-3">Logout</span>
            </button>
          </div>
          <div className="hidden lg:block px-4 pb-3">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p>HR Portal v1.0</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-navy-700">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-500 rounded-lg">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
            <Users size={16} className="text-white" />
          </div>
          <span className="font-bold font-serif text-sm">HR Portal</span>
        </div>
        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Mobile slide menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-navy-900 to-navy-800 shadow-xl p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold font-serif text-white">HR Portal</h1>
                <p className="text-[10px] text-slate-500">{user?.name}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-purple-500/10 text-purple-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:ml-14 lg:ml-64 flex flex-col min-h-screen">
        <header className="hidden md:flex sticky top-0 z-40 h-14 items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-[var(--surface)]/80 backdrop-blur-xl border-b-2 border-purple-500/20 shadow-sm">
          <div />
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:text-purple-500 rounded-lg transition-colors">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-navy-800/90 backdrop-blur-xl border-t border-slate-200 dark:border-navy-700 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {mobileTabItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${isActive ? 'text-purple-500' : 'text-slate-400'}`}>
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
