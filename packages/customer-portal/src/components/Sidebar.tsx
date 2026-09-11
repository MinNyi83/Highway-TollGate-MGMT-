import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface RailItem {
  to: string;
  icon: any;
  label: string;
}

interface SidebarProps {
  items: RailItem[];
  logo?: string;
  logoIcon?: any;
  onLogout?: () => void;
}

export default function Sidebar({ items, logo = 'TG', logoIcon: LogoIcon, onLogout }: SidebarProps) {
  const { user } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden md:flex flex-col h-screen transition-all duration-300
      w-14 lg:w-64
      bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900
      border-r border-navy-700/40
      shadow-xl shadow-navy-950/30">

      {/* Logo */}
      <div className="p-3 lg:p-5 shrink-0">
        <div className="flex items-center gap-3">
          {LogoIcon ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-md shrink-0">
              <LogoIcon size={18} className="text-white" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-md shrink-0">
              <span className="text-white font-bold text-xs font-serif">{logo}</span>
            </div>
          )}
          <div className="hidden lg:block overflow-hidden">
            <h1 className="font-bold font-serif text-base text-white leading-tight">TollGate</h1>
            <p className="text-[10px] text-slate-500">Customer Portal</p>
          </div>
        </div>
      </div>

      {/* User Info (desktop only) */}
      {user && (
        <div className="hidden lg:block mx-3 mb-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">{user.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 lg:px-3 space-y-0.5 custom-scrollbar scrollbar-thin">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent-bg)] text-[var(--accent-text)] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } justify-center lg:justify-start px-2 lg:px-3 py-2.5`
              }
              title={item.label}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden lg:block truncate">{item.label}</span>
              <div className="lg:hidden absolute left-full ml-3 px-2.5 py-1 bg-navy-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg z-50">
                {item.label}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout + Footer */}
      <div className="shrink-0 border-t border-navy-700/40">
        {onLogout && (
          <div className="p-2 lg:p-3">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-2 lg:px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-crimson-400 hover:bg-crimson-500/10 transition-all justify-center lg:justify-start"
              title="Logout"
            >
              <LogOut size={20} className="shrink-0" />
              <span className="hidden lg:block">Logout</span>
            </button>
          </div>
        )}
        <div className="hidden lg:block px-4 pb-3 text-[10px] text-slate-600">
          <p>TollGate RFID Pass v1.0</p>
          <p className="mt-0.5 text-slate-700">Customer Portal</p>
        </div>
      </div>
    </aside>
  );
}
