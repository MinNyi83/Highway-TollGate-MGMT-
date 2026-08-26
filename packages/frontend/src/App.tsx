import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import TollPlazas from './pages/TollPlazas';
import TollPlazaDetail from './pages/TollPlazaDetail';
import TollEvents from './pages/TollEvents';
import Transactions from './pages/Transactions';
import Violations from './pages/Violations';
import Reports from './pages/Reports';
import DeviceStatus from './pages/DeviceStatus';
import Simulator from './pages/Simulator';
import AuditLog from './pages/AuditLog';
import VehicleDetail from './pages/VehicleDetail';
import SystemHealth from './pages/SystemHealth';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/toll-plazas" element={<TollPlazas />} />
              <Route path="/toll-plazas/:id" element={<TollPlazaDetail />} />
              <Route path="/toll-events" element={<TollEvents />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/violations" element={<Violations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/device-status" element={<DeviceStatus />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/system-health" element={<SystemHealth />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
