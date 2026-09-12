import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface RailItem {
  to: string;
  icon: any;
  label: string;
  category?: string;
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
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 shrink-0 transition-transform duration-300 hover:scale-105">
              {LogoIcon ? (
                <LogoIcon size={20} className="text-white" />
              ) : (
                <span className="text-white font-bold text-sm font-serif">{logo}</span>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-navy-900 animate-pulse" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="font-bold font-serif text-base text-white leading-tight tracking-wide">TollGate</h1>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">Command Hub</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="hidden lg:block mx-3 mb-3 p-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center shrink-0 shadow-md">
                <span className="text-xs font-bold text-white">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-navy-800" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-medium tracking-wider">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 lg:px-3 space-y-1 custom-scrollbar scrollbar-thin">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent)]/10 text-[var(--accent-text)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                } justify-center lg:justify-start px-2 lg:px-3 py-2.5`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator - left bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--accent)] rounded-r-full shadow-[0_0_8px_var(--accent)]" />
                  )}

                  {/* Icon container */}
                  <div className={`
                    relative flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--accent)]/15 shadow-sm shadow-[var(--accent)]/10'
                      : 'group-hover:bg-white/5'
                    }
                  `}>
                    <Icon size={18} className={`transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />

                    {/* Glow dot for active */}
                    {isActive && (
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_6px_var(--accent)]" />
                    )}
                  </div>

                  {/* Label (desktop) */}
                  <span className={`hidden lg:block truncate ml-3 transition-all duration-200 ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>

                  {/* Tooltip (tablet icon-only mode) */}
                  <div className="lg:hidden fixed left-[4.5rem] z-[9999] pointer-events-none
                    opacity-0 group-hover:opacity-100
                    translate-x-[-4px] group-hover:translate-x-0
                    transition-all duration-200 ease-out">
                    <div className="flex items-center gap-2 px-3 py-2 bg-navy-700/95 backdrop-blur-xl text-white text-xs font-medium rounded-xl shadow-xl shadow-navy-950/50 border border-navy-600/50 whitespace-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                      {item.label}
                      {/* Arrow */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-navy-700/95 rotate-45 border-l border-b border-navy-600/50" />
                    </div>
                  </div>
                </>
              )}
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
              className="group w-full flex items-center rounded-xl text-sm font-medium text-slate-400 hover:text-crimson-400 hover:bg-crimson-500/10 transition-all justify-center lg:justify-start px-2 lg:px-3 py-2.5"
              title="Logout"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 group-hover:bg-crimson-500/10 transition-all">
                <LogOut size={18} className="transition-all duration-200 group-hover:scale-105" />
              </div>
              <span className="hidden lg:block ml-3">Logout</span>
            </button>
          </div>
        )}
        <div className="hidden lg:block px-4 pb-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p>TollGate RFID Pass v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
