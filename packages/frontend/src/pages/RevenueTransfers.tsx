import RevenueTransferMonitor from '../components/command-hub/RevenueTransferMonitor';
import TelemetryBar from '../components/command-hub/TelemetryBar';

export default function RevenueTransfers() {
  return (
    <div className="min-h-screen bg-gradient-command">
      <TelemetryBar />
      <div className="p-6 space-y-6 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Daily Revenue Transfers & Plaza Settlement</h1>
            <p className="text-xs text-gray-400 mt-1">
              Real-time monitoring of live today revenue, previous day collections, and bank transfer settlement statuses across all highway toll plazas.
            </p>
          </div>
        </div>
        <RevenueTransferMonitor />
      </div>
    </div>
  );
}
