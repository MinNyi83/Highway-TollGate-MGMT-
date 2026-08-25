import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import { useAuthStore } from '../stores/authStore';
import { LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div></div>
          <div className="flex items-center gap-4">
            <NotificationPanel />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{user?.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
