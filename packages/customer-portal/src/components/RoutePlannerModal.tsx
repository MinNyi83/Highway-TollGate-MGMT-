import { useState } from 'react';
import { Map, XCircle, Navigation, Clock, Fuel, ShieldCheck, Coffee, Zap } from 'lucide-react';

interface RoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAZA_STOPS = [
  { id: '0MILE', name: 'Yangon 0-Mile Terminal', mile: 0 },
  { id: 'BAGO39', name: 'Bago Junction Bypass', mile: 39 },
  { id: 'PHYU115', name: 'Phyu Highway Oasis Rest Plaza', mile: 115, restStop: true },
  { id: 'NPT201', name: 'Naypyitaw Capital Gate', mile: 201 },
  { id: 'MEIK285', name: 'Meiktila Junction Stop', mile: 285 },
  { id: 'MDY352', name: 'Mandalay Southern Gate', mile: 352 },
];

const TOLL_RATES_PER_MILE: Record<string, number> = {
  SEDAN: 25, // 25 MMK/mile
  SUV: 35,
  VAN: 45,
  BUS: 65,
  TRUCK: 95,
};

export default function RoutePlannerModal({ isOpen, onClose }: RoutePlannerModalProps) {
  const [originId, setOriginId] = useState('0MILE');
  const [destId, setDestId] = useState('MDY352');
  const [vehicleClass, setVehicleClass] = useState('SEDAN');

  if (!isOpen) return null;

  const originPlaza = PLAZA_STOPS.find((p) => p.id === originId) || PLAZA_STOPS[0];
  const destPlaza = PLAZA_STOPS.find((p) => p.id === destId) || PLAZA_STOPS[5];

  const totalDistanceMiles = Math.abs(destPlaza.mile - originPlaza.mile);
  const totalDistanceKm = Math.round(totalDistanceMiles * 1.60934);
  const ratePerMile = TOLL_RATES_PER_MILE[vehicleClass] || 25;
  const estimatedTollCost = Math.max(1000, totalDistanceMiles * ratePerMile);
  const estimatedDriveHours = (totalDistanceMiles / 55).toFixed(1); // avg 55 mph / 90 km/h
  const estimatedFuelLiters = Math.round((totalDistanceKm / 12)); // 12 km/L avg

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 border border-blue-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Map size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Expressway Trip & Toll Calculator</h3>
              <p className="text-[10px] text-blue-100">Plan toll fees, duration, and rest stops</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">ENTRY PLAZA</label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white"
              >
                {PLAZA_STOPS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.mile}M)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">EXIT PLAZA</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white"
              >
                {PLAZA_STOPS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.mile}M)</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">VEHICLE CLASS</label>
            <div className="grid grid-cols-5 gap-1.5 mt-1">
              {['SEDAN', 'SUV', 'VAN', 'BUS', 'TRUCK'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVehicleClass(v)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                    vehicleClass === v
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Estimated Toll Fee</span>
              <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                K{estimatedTollCost.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/40 dark:border-blue-900/40 text-center text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 shadow-sm">
                <Navigation size={14} className="text-blue-500 mx-auto mb-0.5" />
                <p className="text-[10px] text-gray-400">Distance</p>
                <p className="font-bold text-gray-900 dark:text-white">{totalDistanceMiles} Miles</p>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 shadow-sm">
                <Clock size={14} className="text-emerald-500 mx-auto mb-0.5" />
                <p className="text-[10px] text-gray-400">Duration</p>
                <p className="font-bold text-gray-900 dark:text-white">~{estimatedDriveHours} Hours</p>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-gray-800/80 shadow-sm">
                <Fuel size={14} className="text-amber-500 mx-auto mb-0.5" />
                <p className="text-[10px] text-gray-400">Est. Fuel</p>
                <p className="font-bold text-gray-900 dark:text-white">~{estimatedFuelLiters} L</p>
              </div>
            </div>
          </div>

          {/* Rest Stop Recommendation */}
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Coffee size={16} />
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                Phyu 115-Mile Rest Stop Amenities <Zap size={12} className="text-emerald-500" />
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Food Court, EV Fast Charging (120kW), Clean Restrooms & Fuel Station.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all"
          >
            Done Planning
          </button>
        </div>
      </div>
    </div>
  );
}
