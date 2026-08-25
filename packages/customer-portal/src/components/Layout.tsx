import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, AlertTriangle, Wallet, LogOut, Car } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/toll-history', icon: History, label: 'Toll History' },
  { to: '/violations', icon: AlertTriangle, label: 'Violations' },
  { to: '/account', icon: Wallet, label: 'Account' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Car className="text-blue-400" size={24} />
            <h1 className="text-xl font-bold">TollGate</h1>
          </div>
          <p className="text-gray-400 text-sm">Customer Portal</p>
        </div>
        <nav className="flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md mb-1 transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400 mb-2">{user?.name}</p>
          <p className="text-xs text-gray-500 mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm w-full"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
