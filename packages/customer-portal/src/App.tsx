import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { LanguageProvider } from './hooks/useLanguage';
import { ThemeProvider } from './hooks/useTheme';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TollHistory from './pages/TollHistory';
import Violations from './pages/Violations';
import Account from './pages/Account';
import Settings from './pages/Settings';
import MyVehicles from './pages/MyVehicles';
import FleetDashboard from './pages/FleetDashboard';
import Layout from './components/Layout';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/toll-history" element={<TollHistory />} />
                <Route path="/violations" element={<Violations />} />
                <Route path="/account" element={<Account />} />
                <Route path="/my-vehicles" element={<MyVehicles />} />
                <Route path="/fleet" element={<FleetDashboard />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
