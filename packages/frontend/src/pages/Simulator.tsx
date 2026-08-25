import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  Play,
  Square,
  Settings,
  Car,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  rfidTags: Array<{ id: string; tagUid: string; status: string }>;
}

interface TollPlaza {
  id: string;
  name: string;
  location: string;
}

type Scenario = 'normal' | 'no-rfid' | 'anpr-mismatch' | 'insufficient-balance';

interface SimEvent {
  id: string;
  timestamp: string;
  vehiclePlate: string;
  plazaName: string;
  scenario: Scenario;
  status: 'success' | 'error' | 'pending';
  message: string;
  entryTime: string;
  exitTime: string | null;
  tollAmount: number | null;
}

interface Stats {
  total: number;
  success: number;
  errors: number;
  violations: number;
  revenue: number;
}

const SCENARIO_LABELS: Record<Scenario, string> = {
  normal: 'Normal',
  'no-rfid': 'No RFID',
  'anpr-mismatch': 'ANPR Mismatch',
  'insufficient-balance': 'Insufficient Balance',
};

function generateFakePlate(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const plate = Array.from({ length: 3 }, () =>
    letters[Math.floor(Math.random() * letters.length)]
  ).join('');
  const nums = Math.floor(1000 + Math.random() * 9000);
  return plate + ' ' + nums;
}

const STATUS_STYLES: Record<string, string> = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const SCENARIO_STYLES: Record<Scenario, string> = {
  normal: 'bg-blue-100 text-blue-800',
  'no-rfid': 'bg-orange-100 text-orange-800',
  'anpr-mismatch': 'bg-red-100 text-red-800',
  'insufficient-balance': 'bg-yellow-100 text-yellow-800',
};

export default function Simulator() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedPlazaId, setSelectedPlazaId] = useState<string>('');
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [delayMs, setDelayMs] = useState<number>(1500);
  const [maxEvents, setMaxEvents] = useState<number>(10);
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    success: 0,
    errors: 0,
    violations: 0,
    revenue: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<boolean>(false);

  const { data: vehicles, isLoading: loadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-list'],
    queryFn: async () => {
      const res = await api.get('/vehicles');
      return res.data;
    },
  });

  const { data: plazas, isLoading: loadingPlazas } = useQuery<TollPlaza[]>({
    queryKey: ['toll-plazas-list'],
    queryFn: async () => {
      const res = await api.get('/toll-plazas');
      return res.data;
    },
  });

  const stopContinuous = useCallback(() => {
    abortRef.current = true;
    setIsContinuous(false);
    setIsRunning(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  const runSimulation = useCallback(async () => {
    if (!selectedVehicleId || !plazas?.length) return;

    const vehicle = vehicles?.find((v) => v.id === selectedVehicleId);
    const plaza = plazas.find((p) => p.id === selectedPlazaId) || plazas[0];
    if (!vehicle || !plaza) return;

    const now = new Date().toISOString();
    const eventId =
      'sim-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

    const pendingEvent: SimEvent = {
      id: eventId,
      timestamp: now,
      vehiclePlate: vehicle.plateNumber,
      plazaName: plaza.name,
      scenario,
      status: 'pending',
      message: 'Processing...',
      entryTime: now,
      exitTime: null,
      tollAmount: null,
    };

    setEvents((prev) => [pendingEvent, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1 }));

    try {
      const rfidTagId =
        scenario === 'no-rfid' ? undefined : vehicle.rfidTags?.[0]?.id;
      const anprPlate =
        scenario === 'anpr-mismatch' ? generateFakePlate() : vehicle.plateNumber;

      const entryPayload: Record<string, unknown> = {
        vehicleId: vehicle.id,
        plazaId: plaza.id,
      };
      if (rfidTagId) entryPayload.rfidTagId = rfidTagId;
      if (anprPlate) entryPayload.anprPlate = anprPlate;

      const entryRes = await api.post('/toll-events/entry', entryPayload);
      const entryData = entryRes.data;

      await new Promise((resolve) => setTimeout(resolve, 300));

      const exitPayload: Record<string, unknown> = {};
      if (scenario === 'anpr-mismatch') {
        exitPayload.anprPlate = generateFakePlate();
      }

      const exitRes = await api.put(
        '/toll-events/' + entryData.id + '/exit',
        exitPayload
      );
      const exitData = exitRes.data;

      const isViolation =
        scenario === 'no-rfid' ||
        scenario === 'anpr-mismatch' ||
        scenario === 'insufficient-balance';

      const completed: SimEvent = {
        ...pendingEvent,
        status: isViolation ? 'error' : 'success',
        message: isViolation
          ? scenario === 'no-rfid'
            ? 'No RFID detected - violation logged'
            : scenario === 'anpr-mismatch'
            ? 'ANPR mismatch detected - violation logged'
            : 'Insufficient balance - violation logged'
          : 'Entry and exit recorded successfully',
        exitTime: exitData.exitTime || new Date().toISOString(),
        tollAmount: exitData.tollAmount || 0,
      };

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? completed : e))
      );
      setStats((prev) => ({
        ...prev,
        success: prev.success + (isViolation ? 0 : 1),
        errors: prev.errors + (isViolation ? 1 : 0),
        violations: prev.violations + (isViolation ? 1 : 0),
        revenue: prev.revenue + (isViolation ? 0 : exitData.tollAmount || 0),
      }));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Simulation failed';
      const failed: SimEvent = {
        ...pendingEvent,
        status: 'error',
        message: errorMsg,
      };
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? failed : e))
      );
      setStats((prev) => ({ ...prev, errors: prev.errors + 1 }));
    }
  }, [selectedVehicleId, selectedPlazaId, scenario, vehicles, plazas]);

  const runSingle = useCallback(async () => {
    setIsRunning(true);
    await runSimulation();
    setIsRunning(false);
  }, [runSimulation]);

  const startContinuous = useCallback(() => {
    abortRef.current = false;
    setIsContinuous(true);
    setIsRunning(true);
    let count = 0;

    const loop = async () => {
      if (abortRef.current || count >= maxEvents) {
        setIsContinuous(false);
        setIsRunning(false);
        return;
      }
      count++;
      await runSimulation();
      if (!abortRef.current && count < maxEvents) {
        intervalRef.current = setTimeout(loop, delayMs);
      } else {
        setIsContinuous(false);
        setIsRunning(false);
      }
    };

    loop();
  }, [runSimulation, delayMs, maxEvents]);

  const clearLog = useCallback(() => {
    setEvents([]);
    setStats({ total: 0, success: 0, errors: 0, violations: 0, revenue: 0 });
  }, []);

  const canSimulate =
    selectedVehicleId && (selectedPlazaId || plazas?.length) && !isRunning;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Toll Simulator</h1>
          <p className="text-sm text-gray-500">
            Simulate vehicle entry and exit events across toll plazas
          </p>
        </div>
        <button
          onClick={clearLog}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Clear Log
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Simulated</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Successful</p>
            <p className="text-xl font-bold text-green-600">{stats.success}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Errors</p>
            <p className="text-xl font-bold text-red-600">{stats.errors}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Violations</p>
            <p className="text-xl font-bold text-orange-600">
              {stats.violations}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-xl font-bold text-purple-600">
              {'$'}{stats.revenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Control Panel */}
        <div className="w-80 flex-shrink-0 bg-white rounded-lg shadow p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="flex items-center gap-2 pb-3 border-b">
            <Settings className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-sm">Control Panel</h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Car className="w-3 h-3 inline mr-1" />
              Vehicle
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              disabled={loadingVehicles}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loadingVehicles ? 'Loading...' : 'Select vehicle'}
              </option>
              {vehicles?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} - {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <MapPin className="w-3 h-3 inline mr-1" />
              Plaza
            </label>
            <select
              value={selectedPlazaId}
              onChange={(e) => setSelectedPlazaId(e.target.value)}
              disabled={loadingPlazas}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {loadingPlazas ? 'Loading...' : 'Select plaza'}
              </option>
              {plazas?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Scenario
            </label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as Scenario)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(Object.keys(SCENARIO_LABELS) as Scenario[]).map((key) => (
                <option key={key} value={key}>
                  {SCENARIO_LABELS[key]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              {scenario === 'normal' && 'RFID + ANPR match, valid balance'}
              {scenario === 'no-rfid' && 'No RFID tag detected at entry'}
              {scenario === 'anpr-mismatch' && 'ANPR plate does not match vehicle'}
              {scenario === 'insufficient-balance' && 'Vehicle has insufficient toll balance'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              <Clock className="w-3 h-3 inline mr-1" />
              Delay: {delayMs}ms
            </label>
            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>500ms</span>
              <span>5000ms</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Max Events
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={maxEvents}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= 100) setMaxEvents(val);
              }}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t">
            <button
              onClick={runSingle}
              disabled={!canSimulate}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="w-4 h-4" />
              Simulate
            </button>

            <div className="flex gap-2">
              <button
                onClick={startContinuous}
                disabled={!canSimulate || isContinuous}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Continuous
              </button>
              <button
                onClick={stopContinuous}
                disabled={!isContinuous}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div className="flex-1 bg-white rounded-lg shadow flex flex-col min-h-0">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <h2 className="font-semibold text-sm">Event Log</h2>
              <span className="text-xs text-gray-400">({events.length})</span>
            </div>
            {isContinuous && (
              <span className="flex items-center gap-1.5 text-xs text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Running
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {events.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No events yet. Configure and click Simulate.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Time
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Vehicle
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Plaza
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Scenario
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Message
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Entry
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Exit
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      Toll
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">
                        {event.vehiclePlate}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {event.plazaName}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${SCENARIO_STYLES[event.scenario]}`}
                        >
                          {SCENARIO_LABELS[event.scenario]}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${STATUS_STYLES[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500 max-w-[200px] truncate">
                        {event.message}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                        {new Date(event.entryTime).toLocaleTimeString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                        {event.exitTime
                          ? new Date(event.exitTime).toLocaleTimeString()
                          : '-'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">
                        {event.tollAmount !== null
                          ? '$' + event.tollAmount.toFixed(2)
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
