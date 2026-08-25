import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, AlertTriangle, Wallet, LogOut, Car, Menu, X, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import NotificationBell from './NotificationBell';
import ToastContainer from './Toast';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/toll-history', icon: History, label: 'History' },
  { to: '/violations', icon: AlertTriangle, label: 'Violations' },
  { to: '/account', icon: Wallet, label: 'Account' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ToastContainer />

      {/* Top Bar - Mobile */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <Car className="text-blue-400" size={20} />
          <span className="font-bold">TollGate</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="bg-gray-800 text-white md:hidden">
          <div className="p-4">
            <p className="text-sm text-gray-400 mb-1">{user?.name}</p>
            <p className="text-xs text-gray-500 mb-3">{user?.email}</p>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-sm">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex bg-gray-900 text-white w-64 min-h-screen p-4 flex-col">
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
                onClick={() => setMenuOpen(false)}
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">{user?.name}</p>
              <NotificationBell />
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom Tab Bar - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
