import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Play, Square, Settings, Car, MapPin, AlertTriangle, CheckCircle, Clock, RefreshCw, Calendar, Sun, Moon, Sunrise, Sunset, Users } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  vehicleClass: string;
  rfidTags: Array<{ id: string; tagUid: string; status: string }>;
}

interface TollPlaza {
  id: string;
  name: string;
  gateCode?: string;
  lanes: number;
}

type Scenario = 'normal' | 'no-rfid' | 'anpr-mismatch' | 'insufficient-balance';
type SimMode = 'manual' | 'holiday';

interface SimEvent {
  id: string;
  timestamp: string;
  vehiclePlate: string;
  plazaName: string;
  scenario: Scenario;
  status: 'success' | 'error' | 'pending';
  message: string;
  tollAmount: number | null;
  direction?: string;
  lane?: string;
}

interface Stats {
  total: number;
  success: number;
  errors: number;
  violations: number;
  revenue: number;
}

interface HolidayConfig {
  name: string;
  description: string;
  vehicleMultiplier: number;
  congestionLevel: string;
  violationRate: number;
}

const SCENARIO_LABELS: Record<Scenario, string> = {
  normal: 'Normal', 'no-rfid': 'No RFID', 'anpr-mismatch': 'ANPR Mismatch', 'insufficient-balance': 'Insufficient Balance',
};

const HOLIDAY_TYPES: Record<string, { label: string; icon: any; color: string; desc: string; config: HolidayConfig }> = {
  thingyan: { label: 'Thingyan', icon: Sun, color: 'bg-blue-100 text-blue-700 border-blue-300', desc: 'April 13-16 - Water Festival, 4x traffic', config: { name: 'Thingyan', description: 'Water Festival', vehicleMultiplier: 4, congestionLevel: 'high', violationRate: 0.25 } },
  thadingyut: { label: 'Thadingyut', icon: Moon, color: 'bg-purple-100 text-purple-700 border-purple-300', desc: 'October - Festival of Lights, 2x traffic', config: { name: 'Thadingyut', description: 'Festival of Lights', vehicleMultiplier: 2, congestionLevel: 'medium', violationRate: 0.15 } },
  weekend: { label: 'Weekend', icon: Sunrise, color: 'bg-green-100 text-green-700 border-green-300', desc: 'Regular weekend, 1.5x traffic', config: { name: 'Weekend', description: 'Regular weekend', vehicleMultiplier: 1.5, congestionLevel: 'low', violationRate: 0.1 } },
  'independence-day': { label: 'National Day', icon: Sunset, color: 'bg-orange-100 text-orange-700 border-orange-300', desc: 'Jan 4 / Feb 12 - 2.5x traffic', config: { name: 'National Day', description: 'Independence/Union Day', vehicleMultiplier: 2.5, congestionLevel: 'medium', violationRate: 0.18 } },
  'normal-day': { label: 'Normal Day', icon: Car, color: 'bg-gray-100 text-gray-700 border-gray-300', desc: 'Regular weekday, baseline traffic', config: { name: 'Normal Day', description: 'Regular weekday', vehicleMultiplier: 1, congestionLevel: 'low', violationRate: 0.05 } },
};

const TRAFFIC_WAVES = [
  { icon: Moon, label: '5AM-6AM', name: 'Early Birds', interval: 4000 },
  { icon: Sunrise, label: '6AM-9AM', name: 'Morning Rush', interval: 1500 },
  { icon: Sun, label: '10AM-3PM', name: 'Midday Flow', interval: 2500 },
  { icon: Sunset, label: '4PM-8PM', name: 'Evening Rush', interval: 1800 },
  { icon: Moon, label: '9PM-5AM', name: 'Night Low', interval: 6000 },
];

function generateFakePlate(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  return Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('') + ' ' + Math.floor(1000 + Math.random() * 9000);
}

const STATUS_STYLES: Record<string, string> = { success: 'bg-green-100 text-green-800', error: 'bg-red-100 text-red-800', pending: 'bg-yellow-100 text-yellow-800' };
const SCENARIO_STYLES: Record<Scenario, string> = { normal: 'bg-blue-100 text-blue-800', 'no-rfid': 'bg-orange-100 text-orange-800', 'anpr-mismatch': 'bg-red-100 text-red-800', 'insufficient-balance': 'bg-yellow-100 text-yellow-800' };

export default function Simulator() {
  const [simMode, setSimMode] = useState<SimMode>('manual');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedPlazaId, setSelectedPlazaId] = useState('');
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [delayMs, setDelayMs] = useState(1500);
  const [maxEvents, setMaxEvents] = useState(10);
  const [events, setEvents] = useState<SimEvent[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, success: 0, errors: 0, violations: 0, revenue: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef(false);

  // Holiday mode state
  const [holidayType, setHolidayType] = useState('weekend');
  const [holidayCount, setHolidayCount] = useState(50);
  const [holidayProgress, setHolidayProgress] = useState({ current: 0, timeOfDay: '', wave: '' });
  const [holidayStats, setHolidayStats] = useState({ byTimeOfDay: {} as Record<string, number>, byVehicleClass: {} as Record<string, number> });

  const { data: vehicles, isLoading: loadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-list'],
    queryFn: async () => (await api.get('/vehicles')).data,
  });

  const { data: plazas, isLoading: loadingPlazas } = useQuery<TollPlaza[]>({
    queryKey: ['toll-plazas-list'],
    queryFn: async () => (await api.get('/toll-plazas')).data,
  });

  const stopContinuous = useCallback(() => {
    abortRef.current = true;
    setIsContinuous(false);
    setIsRunning(false);
    if (intervalRef.current) { clearTimeout(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearTimeout(intervalRef.current); }, []);

  const runSimulation = useCallback(async () => {
    if (!selectedVehicleId || !plazas?.length) return;
    const vehicle = vehicles?.find((v) => v.id === selectedVehicleId);
    const plaza = plazas.find((p) => p.id === selectedPlazaId) || plazas[0];
    if (!vehicle || !plaza) return;

    const now = new Date().toISOString();
    const eventId = 'sim-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const pendingEvent: SimEvent = { id: eventId, timestamp: now, vehiclePlate: vehicle.plateNumber, plazaName: plaza.name, scenario, status: 'pending', message: 'Processing...', tollAmount: null };

    setEvents((prev) => [pendingEvent, ...prev]);
    setStats((prev) => ({ ...prev, total: prev.total + 1 }));

    try {
      const rfidTagId = scenario === 'no-rfid' ? undefined : vehicle.rfidTags?.[0]?.id;
      const anprPlate = scenario === 'anpr-mismatch' ? generateFakePlate() : vehicle.plateNumber;
      const entryPayload: Record<string, unknown> = { vehicleId: vehicle.id, plazaId: plaza.id };
      if (rfidTagId) entryPayload.rfidTagId = rfidTagId;
      if (anprPlate) entryPayload.anprPlate = anprPlate;

      const entryRes = await api.post('/toll-events/entry', entryPayload);
      await new Promise((r) => setTimeout(r, 300));

      const exitPayload: Record<string, unknown> = {};
      if (scenario === 'anpr-mismatch') exitPayload.anprPlate = generateFakePlate();
      const exitRes = await api.put('/toll-events/' + entryRes.data.id + '/exit', exitPayload);

      const isViolation = scenario === 'no-rfid' || scenario === 'anpr-mismatch' || scenario === 'insufficient-balance';
      const completed: SimEvent = {
        ...pendingEvent, status: isViolation ? 'error' : 'success',
        message: isViolation ? `${scenario} violation logged` : 'Entry and exit recorded',
        tollAmount: exitRes.data.tollAmount || 0,
      };

      setEvents((prev) => prev.map((e) => (e.id === eventId ? completed : e)));
      setStats((prev) => ({
        ...prev, success: prev.success + (isViolation ? 0 : 1), errors: prev.errors + (isViolation ? 1 : 0),
        violations: prev.violations + (isViolation ? 1 : 0), revenue: prev.revenue + (isViolation ? 0 : exitRes.data.tollAmount || 0),
      }));
    } catch {
      const failed: SimEvent = { ...pendingEvent, status: 'error', message: 'Simulation failed' };
      setEvents((prev) => prev.map((e) => (e.id === eventId ? failed : e)));
      setStats((prev) => ({ ...prev, errors: prev.errors + 1 }));
    }
  }, [selectedVehicleId, selectedPlazaId, scenario, vehicles, plazas]);

  const runSingle = useCallback(async () => { setIsRunning(true); await runSimulation(); setIsRunning(false); }, [runSimulation]);

  const startContinuous = useCallback(() => {
    abortRef.current = false; setIsContinuous(true); setIsRunning(true);
    let count = 0;
    const loop = async () => {
      if (abortRef.current || count >= maxEvents) { setIsContinuous(false); setIsRunning(false); return; }
      count++; await runSimulation();
      if (!abortRef.current && count < maxEvents) { intervalRef.current = setTimeout(loop, delayMs); }
      else { setIsContinuous(false); setIsRunning(false); }
    };
    loop();
  }, [runSimulation, delayMs, maxEvents]);

  // Holiday simulation
  const startHolidaySim = useCallback(async () => {
    if (!plazas?.length || !vehicles?.length) return;
    abortRef.current = false; setIsRunning(true); setIsContinuous(true);

    const config = HOLIDAY_TYPES[holidayType]?.config || HOLIDAY_TYPES['normal-day'].config;
    const routePlazas = plazas;
    let count = 0;
    let minute = 300; // 5 AM

    const getTimeOfDay = (m: number) => {
      const h = Math.floor(m / 60) % 24;
      if (h >= 5 && h < 6) return 'early-morning';
      if (h >= 6 && h < 9) return 'morning-rush';
      if (h >= 10 && h < 15) return 'midday';
      if (h >= 16 && h < 20) return 'evening-rush';
      return 'night';
    };

    const getInterval = (tod: string) => {
      const base = TRAFFIC_WAVES.find((w) => w.label.includes(tod === 'morning-rush' ? '6AM' : tod === 'evening-rush' ? '4PM' : tod === 'midday' ? '10AM' : tod === 'night' ? '9PM' : '5AM'));
      return Math.max(800, (base?.interval || 3000) / config.vehicleMultiplier);
    };

    const loop = async () => {
      if (abortRef.current || count >= holidayCount) { setIsContinuous(false); setIsRunning(false); return; }

      const tod = getTimeOfDay(minute);
      const h = Math.floor(minute / 60) % 24;
      const m = minute % 60;
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const wave = TRAFFIC_WAVES.find((w) => w.label.includes(tod === 'morning-rush' ? '6AM' : tod === 'evening-rush' ? '4PM' : tod === 'midday' ? '10AM' : tod === 'night' ? '9PM' : '5AM'));

      setHolidayProgress({ current: count + 1, timeOfDay: timeStr, wave: wave?.name || tod });

      const batchSize = config.congestionLevel === 'high' ? Math.ceil(Math.random() * 3) : config.congestionLevel === 'medium' ? (Math.random() > 0.7 ? 2 : 1) : 1;

      for (let i = 0; i < batchSize && count < holidayCount; i++) {
        const vehicle = vehicles[count % vehicles.length];
        const plaza = routePlazas[Math.floor(Math.random() * routePlazas.length)];
        const direction = Math.random() > 0.5 ? 'UP' : 'DOWN';
        const lane = `${Math.floor(Math.random() * plaza.lanes || 4) + 1}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}`;

        const violation = Math.random() < config.violationRate;
        const scenarioType: Scenario = violation ? (Math.random() < 0.5 ? 'no-rfid' : Math.random() < 0.3 ? 'anpr-mismatch' : 'insufficient-balance') : 'normal';

        const now = new Date().toISOString();
        const eventId = 'hol-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

        setEvents((prev) => [{ id: eventId, timestamp: now, vehiclePlate: vehicle.plateNumber, plazaName: plaza.name || plaza.gateCode || plaza.id, scenario: scenarioType, status: 'pending', message: `${wave?.name || tod} | ${direction} Lane ${lane}`, tollAmount: null, direction, lane }, ...prev.slice(0, 99)]);
        setStats((prev) => ({ ...prev, total: prev.total + 1 }));

        try {
          const rfidTagId = scenarioType === 'no-rfid' ? undefined : vehicle.rfidTags?.[0]?.id;
          const anprPlate = scenarioType === 'anpr-mismatch' ? generateFakePlate() : vehicle.plateNumber;
          const entryPayload: Record<string, unknown> = { vehicleId: vehicle.id, plazaId: plaza.id, laneNumber: lane, direction, amount: getTollAmount(vehicle.vehicleClass) };
          if (rfidTagId) entryPayload.rfidTagId = rfidTagId;
          if (anprPlate) entryPayload.anprPlate = anprPlate;

          const entryRes = await api.post('/toll-events/entry', entryPayload);
          await new Promise((r) => setTimeout(r, Math.min(1500, 500)));
          const exitPayload: Record<string, unknown> = {};
          if (scenarioType === 'anpr-mismatch') exitPayload.anprPlate = generateFakePlate();
          const exitRes = await api.put('/toll-events/' + entryRes.data.id + '/exit', exitPayload);

          const isViolation = scenarioType !== 'normal';
          setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, status: isViolation ? 'error' : 'success', message: isViolation ? `${scenarioType} violation` : `${wave?.name} ${direction} Lane ${lane}`, tollAmount: exitRes.data.tollAmount || 0 } : e));
          setStats((prev) => ({
            ...prev, success: prev.success + (isViolation ? 0 : 1), violations: prev.violations + (isViolation ? 1 : 0),
            revenue: prev.revenue + (isViolation ? 0 : exitRes.data.tollAmount || 0),
          }));
          setHolidayStats((prev) => ({
            byTimeOfDay: { ...prev.byTimeOfDay, [tod]: (prev.byTimeOfDay[tod] || 0) + 1 },
            byVehicleClass: { ...prev.byVehicleClass, [vehicle.vehicleClass]: (prev.byVehicleClass[vehicle.vehicleClass] || 0) + 1 },
          }));
        } catch {
          setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, status: 'error', message: 'Failed' } : e));
          setStats((prev) => ({ ...prev, errors: prev.errors + 1 }));
        }
        count++;
      }

      minute += 1 + Math.floor(Math.random() * 3);
      if (minute >= 1440) minute -= 1440;

      if (!abortRef.current && count < holidayCount) {
        intervalRef.current = setTimeout(loop, getInterval(tod));
      } else {
        setIsContinuous(false); setIsRunning(false);
      }
    };

    loop();
  }, [plazas, vehicles, holidayType, holidayCount]);

  function getTollAmount(vc: string) {
    switch (vc) { case 'MOTORCYCLE': return 500; case 'SEDAN': return 1000; case 'SUV': return 2000; case 'TRUCK': return 3000; case 'BUS': return 4000; default: return 1000; }
  }

  const clearLog = useCallback(() => {
    setEvents([]); setStats({ total: 0, success: 0, errors: 0, violations: 0, revenue: 0 });
    setHolidayProgress({ current: 0, timeOfDay: '', wave: '' });
    setHolidayStats({ byTimeOfDay: {}, byVehicleClass: {} });
  }, []);

  const canSimulate = simMode === 'manual'
    ? selectedVehicleId && (selectedPlazaId || (plazas?.length ?? 0) > 0) && !isRunning
    : (vehicles?.length ?? 0) > 0 && (plazas?.length ?? 0) > 0 && !isRunning;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Toll Simulator</h1>
          <p className="text-sm text-gray-500">Simulate vehicle passages across toll plazas</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setSimMode('manual')} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${simMode === 'manual' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
              <Car size={14} className="inline mr-1" /> Manual
            </button>
            <button onClick={() => setSimMode('holiday')} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${simMode === 'holiday' ? 'bg-white shadow text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
              <Calendar size={14} className="inline mr-1" /> Holiday Traffic
            </button>
          </div>
          <button onClick={clearLog} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <RefreshCw className="w-4 h-4" /> Clear
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg"><Car className="w-4 h-4 text-blue-600" /></div>
          <div><p className="text-xs text-gray-500">Total</p><p className="text-lg font-bold">{stats.total}</p></div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="w-4 h-4 text-green-600" /></div>
          <div><p className="text-xs text-gray-500">OK</p><p className="text-lg font-bold text-green-600">{stats.success}</p></div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
          <div><p className="text-xs text-gray-500">Errors</p><p className="text-lg font-bold text-red-600">{stats.errors}</p></div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-lg"><AlertTriangle className="w-4 h-4 text-orange-600" /></div>
          <div><p className="text-xs text-gray-500">Violations</p><p className="text-lg font-bold text-orange-600">{stats.violations}</p></div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg"><Settings className="w-4 h-4 text-purple-600" /></div>
          <div><p className="text-xs text-gray-500">Revenue</p><p className="text-lg font-bold text-purple-600">{stats.revenue.toLocaleString()} MMK</p></div>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Control Panel */}
        <div className="w-80 flex-shrink-0 bg-white rounded-lg shadow p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Settings className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-sm">{simMode === 'manual' ? 'Manual Mode' : 'Holiday Traffic Mode'}</h2>
          </div>

          {simMode === 'manual' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1"><Car className="w-3 h-3 inline mr-1" />Vehicle</label>
                <select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)} disabled={loadingVehicles}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                  <option value="">{loadingVehicles ? 'Loading...' : 'Select vehicle'}</option>
                  {vehicles?.map((v) => <option key={v.id} value={v.id}>{v.plateNumber} - {v.make} {v.model}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1"><MapPin className="w-3 h-3 inline mr-1" />Plaza</label>
                <select value={selectedPlazaId} onChange={(e) => setSelectedPlazaId(e.target.value)} disabled={loadingPlazas}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                  <option value="">{loadingPlazas ? 'Loading...' : 'Select plaza'}</option>
                  {plazas?.map((p) => <option key={p.id} value={p.id}>{p.gateCode || p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Scenario</label>
                <select value={scenario} onChange={(e) => setScenario(e.target.value as Scenario)}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {(Object.keys(SCENARIO_LABELS) as Scenario[]).map((key) => <option key={key} value={key}>{SCENARIO_LABELS[key]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1"><Clock className="w-3 h-3 inline mr-1" />Delay: {delayMs}ms</label>
                <input type="range" min={500} max={5000} step={100} value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Events</label>
                <input type="number" min={1} max={100} value={maxEvents} onChange={(e) => { const v = Number(e.target.value); if (v >= 1 && v <= 100) setMaxEvents(v); }}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Holiday Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(HOLIDAY_TYPES).map(([key, h]) => {
                    const Icon = h.icon;
                    return (
                      <button key={key} onClick={() => setHolidayType(key)}
                        className={`flex items-center gap-2 p-2 rounded-lg border-2 text-left transition-all ${holidayType === key ? h.color + ' border-current' : 'border-gray-200 hover:border-gray-300'}`}>
                        <Icon size={16} />
                        <div>
                          <p className="text-xs font-medium">{h.label}</p>
                          <p className="text-[10px] opacity-70">{h.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1"><Users className="w-3 h-3 inline mr-1" />Vehicles to Simulate</label>
                <input type="number" min={5} max={500} value={holidayCount} onChange={(e) => { const v = Number(e.target.value); if (v >= 5 && v <= 500) setHolidayCount(v); }}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {/* Traffic Waves */}
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Traffic Waves (Simulated Day)</p>
                <div className="space-y-1">
                  {TRAFFIC_WAVES.map((w, i) => {
                    const Icon = w.icon;
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <Icon size={12} className="text-gray-400" />
                        <span className="w-16 font-mono">{w.label}</span>
                        <span>{w.name}</span>
                        <span className="ml-auto text-gray-400">{Math.round(1000 * (HOLIDAY_TYPES[holidayType]?.config.vehicleMultiplier || 1) / (w.interval / 1000))}/s</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Holiday Progress */}
              {isRunning && holidayProgress.wave && (
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Simulation Progress</p>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-sm font-mono text-purple-700">{holidayProgress.timeOfDay}</p>
                    <p className="text-xs text-purple-600">{holidayProgress.wave} | {holidayProgress.current}/{holidayCount}</p>
                    <div className="w-full bg-purple-200 rounded-full h-1.5 mt-1">
                      <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${(holidayProgress.current / holidayCount) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Holiday Stats Breakdown */}
              {Object.keys(holidayStats.byTimeOfDay).length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Traffic by Time</p>
                  <div className="space-y-1">
                    {Object.entries(holidayStats.byTimeOfDay).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs"><span className="text-gray-500">{k}</span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-2 mt-2">By Vehicle Class</p>
                  <div className="space-y-1">
                    {Object.entries(holidayStats.byVehicleClass).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs"><span className="text-gray-500">{k}</span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-2 pt-2 border-t mt-auto">
            {simMode === 'manual' ? (
              <>
                <button onClick={runSingle} disabled={!canSimulate}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                  <Play className="w-4 h-4" /> Simulate
                </button>
                <div className="flex gap-2">
                  <button onClick={startContinuous} disabled={!canSimulate || isContinuous}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <Play className="w-4 h-4" /> Continuous
                  </button>
                  <button onClick={stopContinuous} disabled={!isContinuous}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    <Square className="w-4 h-4" /> Stop
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { startHolidaySim(); }} disabled={!canSimulate}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                  <Play className="w-4 h-4" /> Start Holiday
                </button>
                <button onClick={stopContinuous} disabled={!isContinuous}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                  <Square className="w-4 h-4" /> Stop
                </button>
              </div>
            )}
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
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">No events yet. Configure and click Simulate.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Plate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Plaza</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Lane</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Dir</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Scenario</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">{new Date(event.timestamp).toLocaleTimeString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium font-mono">{event.vehiclePlate}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{event.plazaName}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{event.lane || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {event.direction && <span className={`text-xs ${event.direction === 'UP' ? 'text-blue-500' : 'text-orange-500'}`}>{event.direction === 'UP' ? '↑' : '↓'} {event.direction}</span>}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap"><span className={`px-2 py-0.5 text-xs rounded-full ${SCENARIO_STYLES[event.scenario]}`}>{SCENARIO_LABELS[event.scenario]}</span></td>
                      <td className="px-3 py-2 whitespace-nowrap"><span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_STYLES[event.status]}`}>{event.status}</span></td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{event.tollAmount !== null ? `${event.tollAmount.toLocaleString()} MMK` : '-'}</td>
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
