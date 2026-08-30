import { useState } from 'react';
import { ArrowLeftRight, XCircle, CloudRain, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LaneReversalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LaneConfig {
  id: string;
  name: string;
  defaultDir: 'NORTH' | 'SOUTH';
  currentDir: 'NORTH' | 'SOUTH';
  status: 'OPEN' | 'REVERSED' | 'CLOSED';
}

export default function LaneReversalModal({ isOpen, onClose }: LaneReversalModalProps) {
  const [lanes, setLanes] = useState<LaneConfig[]>([
    { id: 'L1', name: 'Lane 01 (Fast ETC)', defaultDir: 'NORTH', currentDir: 'NORTH', status: 'OPEN' },
    { id: 'L2', name: 'Lane 02 (Cash/Mixed)', defaultDir: 'NORTH', currentDir: 'NORTH', status: 'OPEN' },
    { id: 'L3', name: 'Lane 03 (Tidal Flex)', defaultDir: 'NORTH', currentDir: 'SOUTH', status: 'REVERSED' },
    { id: 'L4', name: 'Lane 04 (South Entry)', defaultDir: 'SOUTH', currentDir: 'SOUTH', status: 'OPEN' },
    { id: 'L5', name: 'Lane 05 (South Mixed)', defaultDir: 'SOUTH', currentDir: 'SOUTH', status: 'OPEN' },
  ]);

  const [broadcastMsg, setBroadcastMsg] = useState('HEAVY RAIN WARNING: SLOW DOWN NEAR MILE 115 REST STOP (MAX 60 KM/H)');
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const toggleLaneReversal = (id: string) => {
    setLanes((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const nextStatus = l.status === 'OPEN' ? 'REVERSED' : l.status === 'REVERSED' ? 'CLOSED' : 'OPEN';
          const nextDir = nextStatus === 'REVERSED' ? (l.defaultDir === 'NORTH' ? 'SOUTH' : 'NORTH') : l.defaultDir;
          return { ...l, status: nextStatus, currentDir: nextDir };
        }
        return l;
      })
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <ArrowLeftRight className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Dynamic Tidal Flow & Highway Broadcast</h3>
              <p className="text-xs text-gray-400">Manage peak-hour lane reversal and emergency VMS signs</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tidal Flow Lanes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Overhead LED Sign & Lane Direction Control</h4>
              <span className="text-[11px] text-gray-400">Click lane to toggle: Open → Reversed → Closed</span>
            </div>

            <div className="space-y-2.5">
              {lanes.map((lane) => (
                <div
                  key={lane.id}
                  onClick={() => toggleLaneReversal(lane.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    lane.status === 'REVERSED'
                      ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/15'
                      : lane.status === 'CLOSED'
                      ? 'bg-rose-500/10 border-rose-500/40 hover:bg-rose-500/15'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center ${
                      lane.status === 'REVERSED'
                        ? 'bg-amber-500 text-slate-950'
                        : lane.status === 'CLOSED'
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {lane.id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{lane.name}</p>
                      <p className="text-xs text-gray-400">Current Flow: <span className="font-semibold text-cyan-300">{lane.currentDir}BOUND</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                      lane.status === 'REVERSED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : lane.status === 'CLOSED'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {lane.status === 'REVERSED' ? '🔄 REVERSED' : lane.status === 'CLOSED' ? '⛔ CLOSED' : '🟢 ACTIVE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Road & Weather Broadcast Composer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <CloudRain size={16} />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Highway Overhead Sign & Driver Mobile Broadcast</h4>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                rows={2}
                placeholder="Enter highway advisory message..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" /> Broadcasts to VMS signs & Customer Portals
                </span>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/25"
                >
                  <Send size={14} />
                  {broadcastSent ? '✓ Broadcast Active' : 'Push Highway Advisory'}
                </button>
              </div>

              {broadcastSent && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 size={16} /> Advisory published to 6 expressway plazas and 12,000 active mobile portals!
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
