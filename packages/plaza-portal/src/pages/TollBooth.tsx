import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Car, LogIn, LogOut, Radio, MapPin, QrCode, Camera, ArrowLeftRight,
  Clock, Search, DollarSign, FileText, Presentation, Settings,
  Wifi, WifiOff, Send, Lock, Unlock, AlertTriangle, ChevronRight,
  Shield, Zap, Eye
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { savePendingEvent, getUnsyncedCount } from '../utils/offlineStorage';
import api from '../api/client';
import NetworkStatus from '../components/NetworkStatus';

type SubView = 'main' | 'map' | 'qr' | 'cctv' | 'tidal' | 'shift' | 'search' | 'rates' | 'report' | 'log-entry' | 'log-exit';

export default function TollBooth() {
  const { plazaId, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [view, setView] = useState<SubView>('main');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleClass, setVehicleClass] = useState('2Axle');
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [gateMode, setGateMode] = useState<'AUTO' | 'FORCE_OPEN' | 'LOCKED'>('AUTO');
  const [shiftInfo] = useState({ number: '04', lane: '01-A', plaza: '0 Mile', startedAt: new Date().toISOString() });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    getUnsyncedCount().then(setPendingCount);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const plazaName = plazaId === '2b28880e-d3d9-4112-9957-fbd1bbfe41f0' ? '0 Mile' :
    plazaId === 'f00c165f-5138-4939-8d50-a162227cf9d5' ? '39 Mile' :
    plazaId === 'a23e3850-c294-46dd-a7de-5c47b1782298' ? '115 Mile' :
    plazaId === '9154d12a-1d6a-48f1-abeb-32d8eb5339d9' ? '200 Mile' : 'Unknown';

  const submitEvent = async (type: 'entry' | 'exit') => {
    if (!plateNumber.trim()) return;
    const event = {
      type,
      plateNumber: plateNumber.toUpperCase(),
      vehicleClass,
      plazaId: plazaId || 'plaza-01',
      timestamp: new Date().toISOString(),
    };
    if (isOnline) {
      try {
        const endpoint = type === 'entry' ? '/toll-events/entry' : '/toll-events/exit';
        const res = await api.post(endpoint, event);
        setLastEvent({ ...res.data, offline: false });
        setPlateNumber('');
      } catch {
        await savePendingEvent(event);
        setPendingCount((c) => c + 1);
        setPlateNumber('');
      }
    } else {
      await savePendingEvent(event);
      setPendingCount((c) => c + 1);
      setLastEvent({ ...event, offline: true });
      setPlateNumber('');
    }
  };

  // Main Operator Console
  if (view === 'main') {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-white">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#111827] via-[#1a2332] to-[#111827] border-b border-cyan-500/20 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Radio size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold tracking-wide">OPERATOR CONSOLE</h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Active Shift #{shiftInfo.number}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lane {shiftInfo.lane} • Plaza {plazaName}-Mile • Gate Barrier: <span className={`font-bold ${gateMode === 'AUTO' ? 'text-emerald-400' : gateMode === 'FORCE_OPEN' ? 'text-amber-400' : 'text-red-400'}`}>{gateMode}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NetworkStatus />
              {pendingCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                  <Send size={10} /> {pendingCount} pending
                </span>
              )}
              <div className="text-right">
                <p className="text-xs text-slate-400">{user?.name}</p>
                <p className="text-[10px] text-slate-500">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Log Vehicle Entry', icon: LogIn, color: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/20', action: () => setView('log-entry') },
              { label: 'Highway Map', icon: MapPin, color: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/20', action: () => setView('map') },
              { label: 'Instant Booth QR', icon: QrCode, color: 'from-teal-500 to-cyan-600', glow: 'shadow-teal-500/20', action: () => setView('qr') },
              { label: 'CCTV HUD', icon: Camera, color: 'from-slate-500 to-slate-600', glow: 'shadow-slate-500/20', action: () => setView('cctv') },
              { label: 'Tidal Flow', icon: ArrowLeftRight, color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20', action: () => setView('tidal') },
              { label: 'Shift Close', icon: Clock, color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20', action: () => setView('shift') },
              { label: 'Quick Tag/Plate Search', icon: Search, color: 'from-blue-500 to-indigo-600', glow: 'shadow-blue-500/20', action: () => setView('search') },
              { label: 'Toll Rates', icon: DollarSign, color: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/20', action: () => setView('rates') },
              { label: 'Daily Report', icon: FileText, color: 'from-orange-500 to-red-600', glow: 'shadow-orange-500/20', action: () => setView('report') },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button key={btn.label} onClick={btn.action}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${btn.color} text-white text-sm font-semibold shadow-lg ${btn.glow} hover:scale-105 active:scale-95 transition-all duration-200`}>
                  <Icon size={16} />
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gate Controls */}
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-2">
            {[
              { mode: 'AUTO' as const, label: 'Auto', icon: Zap, color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' },
              { mode: 'FORCE_OPEN' as const, label: 'Force Open', icon: Unlock, color: 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' },
              { mode: 'LOCKED' as const, label: 'Lock Gate', icon: Lock, color: 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' },
            ].map((g) => {
              const Icon = g.icon;
              return (
                <button key={g.mode} onClick={() => setGateMode(g.mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${gateMode === g.mode ? g.color + ' ring-1 ring-current/30' : 'bg-slate-800/50 border-slate-700/50 text-slate-500 hover:text-slate-300'}`}>
                  <Icon size={12} />
                  {g.label}
                </button>
              );
            })}
            <button onClick={() => setView('main')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-semibold hover:text-white transition-all ml-2">
              <Presentation size={12} />
              Presentation
            </button>
          </div>
        </div>

        {/* Quick Entry Panel */}
        <div className="max-w-7xl mx-auto px-4 pb-6">
          <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Plate Input */}
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs text-slate-400 uppercase tracking-wider font-medium">Plate Number</label>
                <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitEvent('entry')}
                  placeholder="e.g. 1A-1234"
                  className="w-full px-5 py-4 bg-[#0a0e17] border border-slate-700 rounded-xl text-center text-3xl font-mono font-bold uppercase tracking-widest text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  autoFocus />

                {/* Vehicle Class */}
                <div className="grid grid-cols-4 gap-2">
                  {['2Axle', '3Axle', '4Axle', '6Wheel+'].map((cls) => (
                    <button key={cls} onClick={() => setVehicleClass(cls)}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        vehicleClass === cls
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
                      }`}>
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button onClick={() => submitEvent('entry')} disabled={!plateNumber.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <LogIn size={20} />
                  LOG ENTRY
                </button>
                <button onClick={() => submitEvent('exit')} disabled={!plateNumber.trim()}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <LogOut size={20} />
                  LOG EXIT
                </button>
              </div>
            </div>

            {/* Last Event */}
            {lastEvent && (
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 animate-slide-up">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lastEvent.offline ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                  {lastEvent.offline ? <WifiOff size={18} className="text-amber-400" /> : <Wifi size={18} className="text-emerald-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold font-mono">{lastEvent.plateNumber}</p>
                  <p className="text-xs text-slate-400">{lastEvent.type?.toUpperCase()} • {lastEvent.vehicleClass} • {new Date(lastEvent.timestamp).toLocaleTimeString()}</p>
                </div>
                <span className={`text-xs font-medium ${lastEvent.offline ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {lastEvent.offline ? 'Saved Offline' : 'Synced'}
                </span>
              </div>
            )}

            {/* Quick Plates */}
            <div className="mt-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Quick Entry</p>
              <div className="flex gap-2">
                {['ABC-1234', 'XYZ-5678', 'DEF-9012', 'GHI-3456', 'JKL-7890', 'MNO-2345'].map((plate) => (
                  <button key={plate} onClick={() => setPlateNumber(plate)}
                    className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-colors border border-slate-700/30">
                    {plate}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sub-views
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Sub-view Header */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1a2332] to-[#111827] border-b border-slate-700/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('main')} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors">
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-lg font-bold">{getViewTitle(view)}</h1>
          </div>
          <div className="flex items-center gap-2">
            <NetworkStatus />
            <span className="text-xs text-slate-400">{plazaName}-Mile</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === 'log-entry' && <LogVehicleView type="entry" plazaId={plazaId} plazaName={plazaName} onSubmit={submitEvent} plateNumber={plateNumber} setPlateNumber={setPlateNumber} vehicleClass={vehicleClass} setVehicleClass={setVehicleClass} />}
        {view === 'map' && <HighwayMapView />}
        {view === 'qr' && <BoothQRView plazaName={plazaName} />}
        {view === 'cctv' && <CCTVHUDView />}
        {view === 'tidal' && <TidalFlowView />}
        {view === 'shift' && <ShiftCloseView shiftInfo={shiftInfo} />}
        {view === 'search' && <QuickSearchView />}
        {view === 'rates' && <TollRatesView />}
        {view === 'report' && <DailyReportView plazaName={plazaName} />}
      </div>
    </div>
  );
}

function getViewTitle(view: SubView): string {
  const titles: Record<SubView, string> = {
    main: 'Operator Console', 'log-entry': 'Log Vehicle Entry', map: 'Highway Map',
    qr: 'Instant Booth QR', cctv: 'CCTV HUD', tidal: 'Tidal Flow',
    shift: 'Shift Close', search: 'Quick Tag/Plate Search', rates: 'Toll Rates',
    report: 'Daily Report', 'log-exit': 'Log Vehicle Exit',
  };
  return titles[view] || 'Operator Console';
}

// ── Sub-view Components ──

function LogVehicleView({ type, plazaId, plazaName, onSubmit, plateNumber, setPlateNumber, vehicleClass, setVehicleClass }: any) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {type === 'entry' ? <LogIn size={20} className="text-cyan-400" /> : <LogOut size={20} className="text-emerald-400" />}
          {type === 'entry' ? 'Vehicle Entry' : 'Vehicle Exit'} — {plazaName}-Mile Plaza
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-1 block">Plate Number</label>
            <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit(type)}
              placeholder="ABC-1234"
              className="w-full px-5 py-4 bg-[#0a0e17] border border-slate-700 rounded-xl text-center text-3xl font-mono font-bold uppercase tracking-widest text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" autoFocus />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['2Axle', '3Axle', '4Axle', '6Wheel+'].map((cls: string) => (
              <button key={cls} onClick={() => setVehicleClass(cls)}
                className={`py-3 rounded-xl text-sm font-bold uppercase transition-all ${vehicleClass === cls ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'}`}>
                {cls}
              </button>
            ))}
          </div>
          <button onClick={() => onSubmit(type)} disabled={!plateNumber.trim()}
            className={`w-full py-5 rounded-xl font-bold text-xl shadow-lg transition-all disabled:opacity-50 ${
              type === 'entry'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20 hover:scale-[1.01]'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/20 hover:scale-[1.01]'
            } active:scale-[0.99]`}>
            {type === 'entry' ? '⊕ LOG ENTRY' : '✓ LOG EXIT'}
          </button>
        </div>
      </div>
    </div>
  );
}

function HighwayMapView() {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin size={18} className="text-emerald-400" /> Highway 1 Corridor</h2>
        <div className="bg-slate-800/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🛤️</div>
          <p className="text-slate-400 text-sm">Interactive highway map with real-time plaza positions</p>
          <p className="text-slate-500 text-xs mt-2">352 miles • 4 toll plazas • Live traffic data</p>
          <div className="mt-6 flex justify-center gap-6">
            {['0 Mile', '39 Mile', '115 Mile', '200 Mile'].map((p) => (
              <div key={p} className="text-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mx-auto mb-1 animate-pulse" />
                <p className="text-[10px] text-slate-400">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BoothQRView({ plazaName }: any) {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><QrCode size={18} className="text-teal-400" /> Instant Booth QR</h2>
        <div className="bg-white rounded-2xl p-8 w-64 h-64 mx-auto flex items-center justify-center">
          <div className="text-center text-slate-800">
            <QrCode size={120} className="mx-auto text-slate-300" />
            <p className="text-xs font-mono mt-2 text-slate-500">{plazaName}-PLAZA-{Date.now().toString(36).toUpperCase()}</p>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">Scan for instant booth identification</p>
      </div>
    </div>
  );
}

function CCTVHUDView() {
  const [channels] = useState([
    { id: 1, name: 'Lane 01 Entry', status: 'online' },
    { id: 2, name: 'Lane 01 Exit', status: 'online' },
    { id: 3, name: 'Lane 02 Entry', status: 'online' },
    { id: 4, name: 'Lane 02 Exit', status: 'offline' },
    { id: 5, name: 'Overview', status: 'online' },
    { id: 6, name: 'Parking', status: 'online' },
  ]);
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Camera size={18} className="text-slate-400" /> CCTV HUD</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {channels.map((ch) => (
            <div key={ch.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
              <div className="aspect-video bg-[#0a0e17] rounded-lg flex items-center justify-center mb-2 relative">
                <Camera size={24} className="text-slate-600" />
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${ch.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              </div>
              <p className="text-xs font-medium text-slate-300">CH{ch.id} — {ch.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TidalFlowView() {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><ArrowLeftRight size={18} className="text-violet-400" /> Tidal Flow Control</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/30">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Inbound Lanes</p>
            <p className="text-4xl font-bold text-cyan-400">342</p>
            <p className="text-xs text-slate-500 mt-1">vehicles/hour</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/30">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Outbound Lanes</p>
            <p className="text-4xl font-bold text-emerald-400">287</p>
            <p className="text-xs text-slate-500 mt-1">vehicles/hour</p>
          </div>
        </div>
        <div className="mt-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">Lane Configuration</p>
          <div className="flex gap-2">
            {['Lane 1: IN', 'Lane 2: IN', 'Lane 3: OUT', 'Lane 4: OUT'].map((l) => (
              <div key={l} className="flex-1 py-2 rounded-lg bg-[#0a0e17] text-center text-xs font-medium text-slate-300 border border-slate-700/30">{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShiftCloseView({ shiftInfo }: any) {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-amber-400" /> Shift Close — #{shiftInfo.number}</h2>
        <div className="space-y-3">
          {[
            { label: 'Vehicles Processed', value: '847', color: 'text-white' },
            { label: 'Cash Collected', value: '$12,450', color: 'text-emerald-400' },
            { label: 'RFID Tags Scanned', value: '623', color: 'text-cyan-400' },
            { label: 'ANPR Captures', value: '841', color: 'text-violet-400' },
            { label: 'Exceptions', value: '12', color: 'text-amber-400' },
            { label: 'Revenue Transferred', value: '$11,200', color: 'text-emerald-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-700/30">
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
          Close Shift & Generate Report
        </button>
      </div>
    </div>
  );
}

function QuickSearchView() {
  const [query, setQuery] = useState('');
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Search size={18} className="text-blue-400" /> Quick Tag/Plate Search</h2>
        <div className="flex gap-2 mb-4">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by plate, tag UID, or account..."
            className="flex-1 px-4 py-3 bg-[#0a0e17] border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono" />
          <button className="px-6 py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl font-medium hover:bg-blue-500/20 transition-colors">
            <Search size={18} />
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700/30">
          <Eye size={32} className="mx-auto text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">Enter a plate number or tag UID to search</p>
        </div>
      </div>
    </div>
  );
}

function TollRatesView() {
  const rates = [
    { class: '2Axle', motorcycle: '200', car: '500', van: '800', bus: '1200', truck: '1500' },
    { class: '3Axle', motorcycle: '-', car: '-', van: '1200', bus: '1800', truck: '2200' },
    { class: '4Axle', motorcycle: '-', car: '-', van: '-', bus: '2400', truck: '3000' },
    { class: '6Wheel+', motorcycle: '-', car: '-', van: '-', bus: '3000', truck: '4000' },
  ];
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign size={18} className="text-green-400" /> Toll Rates (MMK)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
                <th className="pb-3 font-medium">Class</th>
                <th className="pb-3 font-medium">Motorcycle</th>
                <th className="pb-3 font-medium">Car</th>
                <th className="pb-3 font-medium">Van</th>
                <th className="pb-3 font-medium">Bus</th>
                <th className="pb-3 font-medium">Truck</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.class} className="border-b border-slate-700/30">
                  <td className="py-3 font-bold text-white">{r.class}</td>
                  <td className="py-3 text-slate-300 font-mono">{r.motorcycle}</td>
                  <td className="py-3 text-slate-300 font-mono">{r.car}</td>
                  <td className="py-3 text-slate-300 font-mono">{r.van}</td>
                  <td className="py-3 text-slate-300 font-mono">{r.bus}</td>
                  <td className="py-3 text-slate-300 font-mono">{r.truck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DailyReportView({ plazaName }: any) {
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText size={18} className="text-orange-400" /> Daily Report — {plazaName}-Mile</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Vehicles', value: '1,247', color: 'text-white' },
            { label: 'Revenue', value: '$18,450', color: 'text-emerald-400' },
            { label: 'Avg Wait', value: '2.3 min', color: 'text-cyan-400' },
            { label: 'Violations', value: '8', color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-lg shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
          Generate & Download PDF Report
        </button>
      </div>
    </div>
  );
}
