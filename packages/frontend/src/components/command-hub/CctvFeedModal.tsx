import { useState, useEffect } from 'react';
import { Camera, XCircle, ShieldAlert, CheckCircle, Radio, Scan, AlertTriangle, Eye } from 'lucide-react';

interface CctvFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CctvFeedModal({ isOpen, onClose }: CctvFeedModalProps) {
  const [selectedLane, setSelectedLane] = useState('LANE-01A');
  const [isHotlistAlert, setIsHotlistAlert] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState(99.4);
  const [detectedPlate, setDetectedPlate] = useState('7B-8899');
  const [detectedClass, setDetectedClass] = useState('SEDAN');
  const [barrierLocked, setBarrierLocked] = useState(false);

  // Cycle simulated vehicle detections
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const mockPlates = [
        { plate: '7B-8899', vClass: 'SEDAN', conf: 99.4, hotlist: false },
        { plate: '2C-1122', vClass: 'SUV', conf: 98.8, hotlist: false },
        { plate: '9D-4455', vClass: 'TRUCK', conf: 97.5, hotlist: false },
        { plate: '1A-9999', vClass: 'SEDAN', conf: 99.9, hotlist: true }, // Stolen test
      ];

      const chosen = mockPlates[Math.floor(Math.random() * mockPlates.length)];
      setDetectedPlate(chosen.plate);
      setDetectedClass(chosen.vClass);
      setOcrConfidence(chosen.conf);

      if (chosen.hotlist) {
        setIsHotlistAlert(true);
        setBarrierLocked(true);
      } else {
        setIsHotlistAlert(false);
        setBarrierLocked(false);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between transition-colors ${
          isHotlistAlert ? 'bg-rose-950/80 border-rose-500/50' : 'bg-slate-950/80 border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isHotlistAlert 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse' 
                : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
            }`}>
              <Camera size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">ANPR Optical CCTV HUD</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Radio size={10} className="animate-pulse" /> LIVE STREAM
                </span>
                {isHotlistAlert && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-bounce">
                    POLICE HOTLIST WANTED
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">Yangon 0-Mile Plaza • Real-Time Neural OCR Inference</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <XCircle size={20} />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
          
          {/* Simulated CCTV Background Camera View */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center">
            {/* Highway Lane Lines */}
            <div className="w-full h-full relative opacity-30">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,#1e293b)]" />
              <div className="absolute left-1/4 inset-y-0 w-1 bg-dashed bg-white/40" />
              <div className="absolute right-1/4 inset-y-0 w-1 bg-dashed bg-white/40" />
              <div className="absolute left-1/2 inset-y-0 w-1.5 bg-amber-400/60" />
            </div>
          </div>

          {/* AI Bounding Box Overlay */}
          <div className={`relative z-10 w-72 h-44 rounded-xl border-2 transition-all duration-300 flex flex-col justify-between p-3 ${
            isHotlistAlert
              ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.6)] bg-rose-500/10'
              : 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-cyan-500/5'
          }`}>
            {/* Box Corners */}
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isHotlistAlert ? 'bg-rose-500 text-white' : 'bg-cyan-500 text-slate-950'
              }`}>
                {detectedClass} • {ocrConfidence}% CONF
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
                <Scan size={10} /> 1080p @ 60FPS
              </span>
            </div>

            {/* Simulated Car Silhouette */}
            <div className="flex-1 flex items-center justify-center py-2">
              <div className={`w-32 h-14 rounded-lg border border-dashed flex items-center justify-center ${
                isHotlistAlert ? 'border-rose-400/50 bg-rose-950/40' : 'border-cyan-400/40 bg-cyan-950/30'
              }`}>
                <Eye size={22} className={isHotlistAlert ? 'text-rose-400 animate-pulse' : 'text-cyan-400'} />
              </div>
            </div>

            {/* License Plate Tag Overlay */}
            <div className="flex items-center justify-between bg-black/80 p-2 rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
                  isHotlistAlert ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950'
                }`}>
                  {detectedPlate}
                </span>
                <span className="text-[10px] text-gray-300">MM-YGN</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                <CheckCircle size={10} /> OCR VALID
              </span>
            </div>
          </div>

          {/* OSD Telemetry & Camera Details */}
          <div className="absolute top-4 left-4 font-mono text-xs text-cyan-400/90 space-y-1 bg-black/50 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <p>CAM: CAM-ANPR-01A (HIKVISION 4K)</p>
            <p>LOC: 0-MILE TOLL BOOTH (NORTHBOUND)</p>
            <p>SPEED: 38 KM/H (APPROACH)</p>
          </div>

          <div className="absolute top-4 right-4 font-mono text-xs text-gray-300 text-right bg-black/50 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <p>{new Date().toLocaleTimeString()} UTC+6:30</p>
            <p className="text-emerald-400">LATENCY: 42ms</p>
          </div>

          {/* Hotlist Warning Banner */}
          {isHotlistAlert && (
            <div className="absolute bottom-4 inset-x-4 bg-rose-600/90 text-white px-4 py-2 rounded-xl flex items-center justify-between border border-rose-400 shadow-lg animate-pulse">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} />
                <span className="text-xs font-bold">CRITICAL: VEHICLE ON POLICE WANTED LIST (REPORTED STOLEN)</span>
              </div>
              <span className="text-xs font-mono font-bold bg-black/40 px-2.5 py-1 rounded-lg">
                BARRIER AUTO-LOCKED
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer & Lane Controls */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold">Select Camera Feed:</span>
            {['LANE-01A', 'LANE-02A', 'LANE-03B', 'LANE-04B'].map((lane) => (
              <button
                key={lane}
                onClick={() => setSelectedLane(lane)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                  selectedLane === lane
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                }`}
              >
                {lane}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsHotlistAlert(!isHotlistAlert);
                setBarrierLocked(!barrierLocked);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isHotlistAlert
                  ? 'bg-rose-500 text-white hover:bg-rose-400'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <AlertTriangle size={14} />
              {isHotlistAlert ? 'Clear Hotlist Siren' : 'Simulate Hotlist Siren'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
            >
              Close HUD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
