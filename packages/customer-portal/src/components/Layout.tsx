import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  AlertTriangle, 
  Wallet, 
  LogOut, 
  Car, 
  Menu, 
  X, 
  Settings, 
  Building2, 
  PanelLeftClose, 
  PanelLeftOpen,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../hooks/useTheme';
import NotificationBell from './NotificationBell';
import ToastContainer from './Toast';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/my-vehicles', icon: Car, label: 'Vehicles' },
  { to: '/toll-history', icon: History, label: 'History' },
  { to: '/violations', icon: AlertTriangle, label: 'Violations' },
  { to: '/account', icon: Wallet, label: 'Account' },
  { to: '/fleet', icon: Building2, label: 'Fleet', enterpriseOnly: true },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isEnterprise = user?.customerType === 'ENTERPRISE';
  const filteredNavItems = navItems.filter((item) => !item.enterpriseOnly || isEnterprise);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <ToastContainer />

      {/* Top Bar - Mobile */}
      <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between md:hidden transition-colors">
        <div className="flex items-center gap-2">
          <Car className="text-blue-600 dark:text-blue-400" size={20} />
          <span className="font-bold">TollGate</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 rounded-lg"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>
          <NotificationBell />
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white md:hidden border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{user?.name}</p>
            <p className="text-xs text-gray-500 mb-3">{user?.email}</p>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className={`${collapsed ? 'w-16' : 'w-64'} hidden md:flex bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-800 min-h-screen p-4 flex-col transition-all duration-300`}>
          <div className={`${collapsed ? 'mb-4' : 'mb-8'} transition-all duration-300`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'} mb-1`}>
              <Car className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={collapsed ? 20 : 24} />
              {!collapsed && <h1 className="text-xl font-bold">TollGate</h1>}
            </div>
            {!collapsed && <p className="text-gray-500 dark:text-gray-400 text-sm">Customer Portal</p>}
          </div>
          <nav className="flex-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md mb-1 transition-colors font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          {!collapsed && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{user?.name}</p>
                <NotificationBell />
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header with Collapse & Dark Mode Toggle */}
          <header className="hidden md:flex bg-white dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16 items-center justify-between px-6 transition-colors shadow-sm">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />}
              </button>
              <NotificationBell />
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Bottom Tab Bar - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-1 flex justify-around items-center z-50">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
