import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Car, LogIn, LogOut, AlertCircle, Clock, Wifi, WifiOff, Send } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { savePendingEvent, getUnsyncedCount, PendingEvent } from '../utils/offlineStorage';
import api from '../api/client';
import NetworkStatus from '../components/NetworkStatus';

export default function TollBooth() {
  const { plazaId } = useAuthStore();
  const queryClient = useQueryClient();
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleClass, setVehicleClass] = useState('2Axle');
  const [mode, setMode] = useState<'entry' | 'exit'>('entry');
  const [pendingCount, setPendingCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastEvent, setLastEvent] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    getUnsyncedCount().then(setPendingCount);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  const submitEvent = async () => {
    if (!plateNumber.trim()) return;
    const event: Omit<PendingEvent, 'id' | 'synced'> = {
      type: mode,
      plateNumber: plateNumber.toUpperCase(),
      vehicleClass,
      plazaId: plazaId || 'plaza-01',
      timestamp: new Date().toISOString(),
    };

    if (isOnline) {
      try {
        const endpoint = mode === 'entry' ? '/toll-events/entry' : '/toll-events/exit';
        const res = await api.post(endpoint, event);
        setLastEvent(res.data);
        setPlateNumber('');
      } catch (err: any) {
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

  const syncEvents = async () => {
    const events = await (await import('../utils/offlineStorage')).getPendingEvents();
    const unsynced = events.filter(e => !e.synced);
    if (unsynced.length === 0) return;

    let syncedIds: number[] = [];
    for (const event of unsynced) {
      try {
        const endpoint = event.type === 'entry' ? '/toll-events/entry' : '/toll-events/exit';
        await api.post(endpoint, event);
        if (event.id) syncedIds.push(event.id);
      } catch {}
    }
    if (syncedIds.length > 0) {
      const { markSynced, clearSynced } = await import('../utils/offlineStorage');
      await markSynced(syncedIds);
      await clearSynced();
      setPendingCount(0);
    }
  };

  useEffect(() => {
    if (isOnline && pendingCount > 0) syncEvents();
  }, [isOnline]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Car size={22} className="text-gold-500" />
              Toll Booth
            </h1>
            <p className="text-xs text-slate-400">{plazaId || 'plaza-01'}</p>
          </div>
          <div className="flex items-center gap-2">
            <NetworkStatus />
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium">
                <Send size={10} /> {pendingCount} pending
              </span>
            )}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button onClick={() => setMode('entry')} className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${mode === 'entry' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 animate-pulse-gold' : 'bg-navy-800 text-slate-400 hover:bg-navy-700'}`}>
            <LogIn size={24} className="mx-auto mb-1" />
            ENTRY
          </button>
          <button onClick={() => setMode('exit')} className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${mode === 'exit' ? 'bg-crimson-500 text-white shadow-lg shadow-crimson-500/20' : 'bg-navy-800 text-slate-400 hover:bg-navy-700'}`}>
            <LogOut size={24} className="mx-auto mb-1" />
            EXIT
          </button>
        </div>

        {/* Input */}
        <div className="glass-card p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Plate Number</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitEvent()}
              placeholder="e.g. 1A-1234"
              className="input-field text-center text-2xl font-mono font-bold uppercase tracking-widest"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Vehicle Class</label>
            <div className="grid grid-cols-4 gap-2">
              {['2Axle', '3Axle', '4Axle', '6Wheel+'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setVehicleClass(cls)}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${vehicleClass === cls ? 'bg-gold-500 text-navy-900' : 'bg-navy-800 text-slate-400 hover:bg-navy-700'}`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
          <button onClick={submitEvent} disabled={!plateNumber.trim()} className="btn-primary w-full text-xl py-4">
            {mode === 'entry' ? '📋 Log Entry' : '🏁 Log Exit'}
          </button>
        </div>

        {/* Last Event */}
        {lastEvent && (
          <div className="glass-card p-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lastEvent.offline ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                {lastEvent.offline ? <WifiOff size={24} className="text-amber-500" /> : <Wifi size={24} className="text-emerald-500" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{lastEvent.plateNumber} · {lastEvent.vehicleClass}</p>
                <p className="text-xs text-slate-400">
                  {lastEvent.type.toUpperCase()} · {new Date(lastEvent.timestamp).toLocaleTimeString()}
                  {lastEvent.offline && ' · Saved offline'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick plates */}
        <div className="glass-card p-4">
          <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Quick Entry</p>
          <div className="grid grid-cols-3 gap-2">
            {['ABC-1234', 'XYZ-5678', 'DEF-9012', 'GHI-3456', 'JKL-7890', 'MNO-2345'].map((plate) => (
              <button key={plate} onClick={() => setPlateNumber(plate)} className="py-2 px-3 bg-navy-800 hover:bg-navy-700 rounded-lg text-xs font-mono text-slate-300 transition-colors">
                {plate}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
