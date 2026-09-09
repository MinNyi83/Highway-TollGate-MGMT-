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
import AuditLog from './pages/AuditLog';
import ComparisonReport from './pages/ComparisonReport';
import PlazaPerformance from './pages/PlazaPerformance';
import ViolationAnalytics from './pages/ViolationAnalytics';
import RevenueForecast from './pages/RevenueForecast';
import RevenueHeatmap from './pages/RevenueHeatmap';
import TransactionSearch from './pages/TransactionSearch';
import SettlementPipeline from './pages/SettlementPipeline';
import WalletAnalytics from './pages/WalletAnalytics';
import RevenueByVehicle from './pages/RevenueByVehicle';
import CustomerSpending from './pages/CustomerSpending';
import RevenueByPayment from './pages/RevenueByPayment';
import LoyaltyAnalytics from './pages/LoyaltyAnalytics';
import FinancialReports from './pages/FinancialReports';

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
                      <Route path="/audit-log" element={<AuditLog />} />
                      <Route path="/comparison" element={<ComparisonReport />} />
                      <Route path="/plaza-performance" element={<PlazaPerformance />} />
                      <Route path="/violations" element={<ViolationAnalytics />} />
                      <Route path="/forecast" element={<RevenueForecast />} />
                      <Route path="/heatmap" element={<RevenueHeatmap />} />
                      <Route path="/transactions" element={<TransactionSearch />} />
                      <Route path="/settlement-pipeline" element={<SettlementPipeline />} />
                      <Route path="/wallet-analytics" element={<WalletAnalytics />} />
                      <Route path="/revenue-by-vehicle" element={<RevenueByVehicle />} />
                      <Route path="/customer-spending" element={<CustomerSpending />} />
                      <Route path="/revenue-by-payment" element={<RevenueByPayment />} />
                      <Route path="/loyalty-analytics" element={<LoyaltyAnalytics />} />
                      <Route path="/reports" element={<FinancialReports />} />
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
