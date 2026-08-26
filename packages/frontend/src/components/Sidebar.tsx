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
  Shield,
  HeartPulse
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/vehicles', icon: Car, label: 'Vehicles', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/toll-plazas', icon: MapPin, label: 'Toll Plazas', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/toll-events', icon: Activity, label: 'Toll Events', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/transactions', icon: CreditCard, label: 'Transactions', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/violations', icon: AlertTriangle, label: 'Violations', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  { to: '/device-status', icon: Settings, label: 'Device Status', roles: ['ADMIN', 'OPERATOR'] },
  { to: '/simulator', icon: PlayCircle, label: 'Simulator', roles: ['ADMIN'] },
  { to: '/audit-log', icon: Shield, label: 'Audit Log', roles: ['ADMIN'] },
  { to: '/system-health', icon: HeartPulse, label: 'System Health', roles: ['ADMIN'] },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const { user } = useAuthStore();
  const userRole = user?.role || 'VIEWER';
  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white min-h-screen p-4 transition-all duration-300 flex flex-col`}>
      <div className={`${collapsed ? 'mb-4' : 'mb-8'} transition-all duration-300`}>
        <h1 className={`font-bold ${collapsed ? 'text-lg' : 'text-xl'} transition-all duration-300`}>
          {collapsed ? 'TG' : 'TollGate'}
        </h1>
        {!collapsed && <p className="text-gray-400 text-sm">RFID Pass System</p>}
        {user && !collapsed && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <Shield size={14} />
            <span className="uppercase font-medium">{user.role}</span>
          </div>
        )}
      </div>
      <nav className="flex-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
