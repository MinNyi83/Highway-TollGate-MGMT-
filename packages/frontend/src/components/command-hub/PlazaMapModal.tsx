import { useState } from 'react';
import { MapPin, XCircle, Activity, Radio, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PlazaNode {
  id: string;
  name: string;
  code: string;
  mile: number;
  location: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  activeLanes: number;
  totalLanes: number;
  todayVehicles: number;
  todayRevenue: number;
  x: number; // percentage on map
  y: number; // percentage on map
}

const HIGHWAY_PLAZAS: PlazaNode[] = [
  {
    id: 'plaza-001',
    name: 'Yangon 0-Mile Plaza',
    code: '0MILE',
    mile: 0,
    location: 'Yangon Main Terminal',
    status: 'ONLINE',
    activeLanes: 6,
    totalLanes: 6,
    todayVehicles: 4820,
    todayRevenue: 9640000,
    x: 48,
    y: 85,
  },
  {
    id: 'plaza-002',
    name: 'Bago Junction Plaza',
    code: 'BAGO39',
    mile: 39,
    location: 'Bago Bypass Entry',
    status: 'ONLINE',
    activeLanes: 4,
    totalLanes: 4,
    todayVehicles: 3210,
    todayRevenue: 6420000,
    x: 52,
    y: 73,
  },
  {
    id: 'plaza-003',
    name: 'Phyu Rest Plaza',
    code: 'PHYU115',
    mile: 115,
    location: 'Phyu Highway Stop',
    status: 'ONLINE',
    activeLanes: 4,
    totalLanes: 4,
    todayVehicles: 2780,
    todayRevenue: 5560000,
    x: 50,
    y: 58,
  },
  {
    id: 'plaza-004',
    name: 'Naypyitaw Capital Plaza',
    code: 'NPT201',
    mile: 201,
    location: 'Naypyitaw Southern Gate',
    status: 'ONLINE',
    activeLanes: 6,
    totalLanes: 6,
    todayVehicles: 4150,
    todayRevenue: 8300000,
    x: 47,
    y: 44,
  },
  {
    id: 'plaza-005',
    name: 'Meiktila Junction Plaza',
    code: 'MEIK285',
    mile: 285,
    location: 'Meiktila Crossroads',
    status: 'WARNING',
    activeLanes: 3,
    totalLanes: 4,
    todayVehicles: 1950,
    todayRevenue: 3900000,
    x: 45,
    y: 30,
  },
  {
    id: 'plaza-006',
    name: 'Mandalay Toll Plaza',
    code: 'MDY352',
    mile: 352,
    location: 'Mandalay Southern Gate',
    status: 'ONLINE',
    activeLanes: 6,
    totalLanes: 6,
    todayVehicles: 5320,
    todayRevenue: 10640000,
    x: 43,
    y: 15,
  },
];

interface PlazaMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlazaMapModal({ isOpen, onClose }: PlazaMapModalProps) {
  const [selectedPlaza, setSelectedPlaza] = useState<PlazaNode | null>(HIGHWAY_PLAZAS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-950/60 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <MapPin className="text-cyan-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Yangon - Mandalay Expressway Interactive Map
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE TELEMETRY
                </span>
              </h3>
              <p className="text-xs text-gray-400">Real-time status across 352 Miles & 6 Active Toll Plazas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <XCircle size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          
          {/* Map Visualization Column (2 cols) */}
          <div className="lg:col-span-2 p-6 bg-slate-950/70 relative flex items-center justify-center min-h-[460px] border-r border-white/10 overflow-hidden">
            
            {/* Background Highway Graphic Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
            
            {/* Styled Highway Route Line (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path
                d="M 43% 15% Q 45% 30%, 47% 44% T 50% 58% T 52% 73% T 48% 85%"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 6"
                className="animate-pulse opacity-70"
              />
            </svg>

            {/* Interactive Plaza Nodes */}
            <div className="relative w-full h-full min-h-[420px]">
              {HIGHWAY_PLAZAS.map((plaza) => {
                const isSelected = selectedPlaza?.id === plaza.id;
                return (
                  <button
                    key={plaza.id}
                    onClick={() => setSelectedPlaza(plaza)}
                    style={{ left: `${plaza.x}%`, top: `${plaza.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 focus:outline-none z-10`}
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Pulse Ring */}
                      <span className={`absolute w-8 h-8 rounded-full opacity-75 animate-ping ${
                        plaza.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />

                      {/* Main Node */}
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-lg transition-transform ${
                        isSelected 
                          ? 'bg-cyan-500 border-white text-black scale-125 ring-4 ring-cyan-500/40' 
                          : plaza.status === 'ONLINE'
                            ? 'bg-slate-900 border-emerald-400 text-emerald-400 group-hover:scale-110'
                            : 'bg-slate-900 border-amber-400 text-amber-400 group-hover:scale-110'
                      }`}>
                        {plaza.mile}M
                      </div>

                      {/* Tooltip Label */}
                      <div className={`absolute left-10 whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all ${
                        isSelected 
                          ? 'bg-cyan-950/90 text-cyan-200 border-cyan-500/50 shadow-md' 
                          : 'bg-slate-900/80 text-gray-300 border-white/10 opacity-80 group-hover:opacity-100'
                      }`}>
                        {plaza.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-900/90 border border-white/10 backdrop-blur-md text-xs space-y-1 text-gray-300">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <span>Highway 01 Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Online & Optimal Flow</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Heavy Traffic / Lane Alert</span>
              </div>
            </div>
          </div>

          {/* Plaza Detail Sidebar (1 col) */}
          <div className="p-6 bg-slate-900/90 flex flex-col justify-between space-y-4 overflow-y-auto">
            {selectedPlaza ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    GATE {selectedPlaza.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedPlaza.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {selectedPlaza.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white">{selectedPlaza.name}</h4>
                  <p className="text-xs text-gray-400">{selectedPlaza.location} (Mile Marker {selectedPlaza.mile})</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400">Active Lanes</p>
                    <p className="text-lg font-bold font-mono text-cyan-300">
                      {selectedPlaza.activeLanes}/{selectedPlaza.totalLanes}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400">Today's Traffic</p>
                    <p className="text-lg font-bold font-mono text-emerald-400">
                      {selectedPlaza.todayVehicles.toLocaleString()} vph
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/20">
                  <p className="text-xs text-gray-400">Estimated Daily Revenue</p>
                  <p className="text-2xl font-bold font-mono text-emerald-400">
                    K{selectedPlaza.todayRevenue.toLocaleString()}
                  </p>
                </div>

                {/* Status Checks */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-300 py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5"><Radio size={14} className="text-cyan-400" /> RFID Readers</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1"><ShieldCheck size={14} /> 100% OK</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300 py-1 border-b border-white/5">
                    <span className="flex items-center gap-1.5"><Activity size={14} className="text-indigo-400" /> ANPR Cameras</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1"><ShieldCheck size={14} /> 99.8% Accuracy</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300 py-1">
                    <span className="flex items-center gap-1.5"><AlertTriangle size={14} className="text-amber-400" /> Active Violations</span>
                    <span className="font-mono text-amber-400 font-bold">12 Flagged</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                Click a plaza marker on the highway to view real-time diagnostics.
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all"
            >
              Close Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
