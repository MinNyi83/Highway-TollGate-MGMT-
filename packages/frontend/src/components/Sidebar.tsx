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
  Shield
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
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const userRole = user?.role || 'VIEWER';
  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">TollGate</h1>
        <p className="text-gray-400 text-sm">RFID Pass System</p>
        {user && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <Shield size={14} />
            <span className="uppercase font-medium">{user.role}</span>
          </div>
        )}
      </div>
      <nav>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
