import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';

interface RailItem {
  to: string;
  icon: any;
  label: string;
}

interface FloatingRailProps {
  items: RailItem[];
  logo?: string;
  logoIcon?: any;
  footer?: React.ReactNode;
  onLogout?: () => void;
  className?: string;
}

export default function FloatingRail({ items, logo = 'TG', logoIcon: LogoIcon, footer, onLogout, className = '' }: FloatingRailProps) {
  return (
    <aside className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center w-14 py-4 rounded-2xl bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl border border-slate-200/40 dark:border-navy-600/30 shadow-classical-lg transition-all duration-300 ${className}`}>
      <div className="mb-4">
        {LogoIcon ? (
          <LogoIcon size={22} className="text-gold-500" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-[10px] font-serif">{logo}</span>
          </div>
        )}
      </div>

      <nav className="flex-1 flex flex-col items-center gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-500 shadow-sm shadow-gold-500/10'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-navy-800 dark:bg-navy-700 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg z-50">
                {item.label}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {onLogout && (
        <button
          onClick={onLogout}
          className="mt-2 w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-crimson-500 hover:bg-crimson-500/10 transition-all"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      )}

      {footer && (
        <div className="mt-2 pt-2 border-t border-slate-200/40 dark:border-navy-600/30">
          {footer}
        </div>
      )}
    </aside>
  );
}
