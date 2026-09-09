import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './i18n';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyCollection from './pages/DailyCollection';
import RevenueByRegion from './pages/RevenueByRegion';
import TopUpByRegion from './pages/TopUpByRegion';
import VehicleByRegion from './pages/VehicleByRegion';
import TollUsageByPlaza from './pages/TollUsageByPlaza';
import Settlement from './pages/Settlement';
import MonthlyReconciliation from './pages/MonthlyReconciliation';
import OfficialReceipts from './pages/OfficialReceipts';
import FiscalYearReport from './pages/FiscalYearReport';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/daily-collection" element={<DailyCollection />} />
                      <Route path="/revenue-by-region" element={<RevenueByRegion />} />
                      <Route path="/topup-by-region" element={<TopUpByRegion />} />
                      <Route path="/vehicle-by-region" element={<VehicleByRegion />} />
                      <Route path="/toll-usage" element={<TollUsageByPlaza />} />
                      <Route path="/settlement" element={<Settlement />} />
                      <Route path="/reconciliation" element={<MonthlyReconciliation />} />
                      <Route path="/receipts" element={<OfficialReceipts />} />
                      <Route path="/fiscal-year" element={<FiscalYearReport />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
