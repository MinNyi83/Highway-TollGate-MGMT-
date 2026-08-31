import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  MapPin, 
  Activity, 
  CreditCard, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  PlayCircle,
  Presentation,
  Shield,
  HeartPulse,
  Users,
  Cpu,
  Radio
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Command Center', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/vehicles', icon: Car, label: 'Vehicles', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/toll-plazas', icon: MapPin, label: 'Toll Plazas', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/toll-events', icon: Activity, label: 'Toll Events', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/transactions', icon: CreditCard, label: 'Transactions', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/violations', icon: AlertTriangle, label: 'Violations', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/customers', icon: Users, label: 'Customers', roles: ['ADMIN'] },
  { to: '/devices', icon: Cpu, label: 'Devices', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/device-status', icon: Settings, label: 'Device Status', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/presentation', icon: Presentation, label: 'Presentation', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/simulator', icon: PlayCircle, label: 'Simulator', roles: ['ADMIN'] },
  { to: '/audit-log', icon: Shield, label: 'Audit Log', roles: ['ADMIN'] },
  { to: '/system-health', icon: HeartPulse, label: 'System Health', roles: ['ADMIN'] },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const { user } = useAuthStore();
  const userRole = user?.role || 'VIEWER';
  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/10 min-h-screen transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className={`${collapsed ? 'p-4' : 'p-5'} transition-all duration-300`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center shadow-md shadow-brand-500/20">
            <Radio size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white">TollGate</h1>
              <p className="text-xs text-slate-500 dark:text-gray-400">Command Hub</p>
            </div>
          )}
        </div>

        {user && !collapsed && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 uppercase font-medium">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-400 dark:text-gray-500">
          <p>TollGate RFID Pass v1.0</p>
          <p className="mt-0.5 text-[10px] text-slate-400 dark:text-gray-600">Enterprise Highway OS</p>
        </div>
      )}
    </aside>
  );
}
