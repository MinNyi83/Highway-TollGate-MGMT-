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
  PlayCircle
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vehicles', icon: Car, label: 'Vehicles' },
  { to: '/toll-plazas', icon: MapPin, label: 'Toll Plazas' },
  { to: '/toll-events', icon: Activity, label: 'Toll Events' },
  { to: '/transactions', icon: CreditCard, label: 'Transactions' },
  { to: '/violations', icon: AlertTriangle, label: 'Violations' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/device-status', icon: Settings, label: 'Device Status' },
  { to: '/simulator', icon: PlayCircle, label: 'Simulator' },
];

export default function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">TollGate</h1>
        <p className="text-gray-400 text-sm">RFID Pass System</p>
      </div>
      <nav>
        {navItems.map((item) => (
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
