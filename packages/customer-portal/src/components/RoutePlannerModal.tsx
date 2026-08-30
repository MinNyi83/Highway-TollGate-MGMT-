import { useState, useEffect, useRef } from 'react';
import { Map, XCircle, Navigation, Clock, Fuel, ShieldCheck, Coffee, Zap } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RoutePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlazaStop {
  id: string;
  name: string;
  mile: number;
  lat: number;
  lng: number;
  restStop?: boolean;
}

const PLAZA_STOPS: PlazaStop[] = [
  { id: '0MILE', name: 'Yangon 0-Mile Terminal', mile: 0, lat: 17.0372, lng: 96.1788 },
  { id: 'BAGO39', name: 'Bago Junction Bypass', mile: 39, lat: 17.3353, lng: 96.4817 },
  { id: 'PHYU115', name: 'Phyu Highway Oasis Rest Plaza', mile: 115, lat: 18.5284, lng: 96.4385, restStop: true },
  { id: 'NPT201', name: 'Naypyitaw Capital Gate', mile: 201, lat: 19.7450, lng: 96.1297 },
  { id: 'MEIK285', name: 'Meiktila Junction Stop', mile: 285, lat: 20.8762, lng: 95.8611 },
  { id: 'MDY352', name: 'Mandalay Southern Gate', mile: 352, lat: 21.9750, lng: 96.0836 },
];

const HIGHWAY_FULL_ROUTE: [number, number][] = [
  [17.0372, 96.1788],
  [17.1500, 96.2500],
  [17.3353, 96.4817],
  [17.6500, 96.5200],
  [17.9800, 96.4900],
  [18.2500, 96.4600],
  [18.5284, 96.4385],
  [18.9000, 96.3800],
  [19.3000, 96.2500],
  [19.7450, 96.1297],
  [20.1500, 96.0200],
  [20.5500, 95.9200],
  [20.8762, 95.8611],
  [21.2000, 95.9200],
  [21.6000, 96.0200],
  [21.9750, 96.0836],
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const originPlaza = PLAZA_STOPS.find((p) => p.id === originId) || PLAZA_STOPS[0];
  const destPlaza = PLAZA_STOPS.find((p) => p.id === destId) || PLAZA_STOPS[5];

  const totalDistanceMiles = Math.abs(destPlaza.mile - originPlaza.mile);
  const totalDistanceKm = Math.round(totalDistanceMiles * 1.60934);
  const ratePerMile = TOLL_RATES_PER_MILE[vehicleClass] || 25;
  const estimatedTollCost = Math.max(1000, totalDistanceMiles * ratePerMile);
  const estimatedDriveHours = (totalDistanceMiles / 55).toFixed(1);
  const estimatedFuelLiters = Math.round(totalDistanceKm / 12);
  const minMile = Math.min(originPlaza.mile, destPlaza.mile);
  const maxMile = Math.max(originPlaza.mile, destPlaza.mile);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.5, 96.2],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
      }).addTo(map);

      // Background route (full highway)
      L.polyline(HIGHWAY_FULL_ROUTE, {
        color: '#94a3b8',
        weight: 3,
        opacity: 0.5,
        dashArray: '5, 5',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers & selected segment
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
    }

    // Filter waypoints between origin and dest
    const minMile = Math.min(originPlaza.mile, destPlaza.mile);
    const maxMile = Math.max(originPlaza.mile, destPlaza.mile);
    
    // Add origin marker
    const originIcon = L.divIcon({
      className: 'route-origin-marker',
      html: `
        <div style="background: #2563eb; color: #fff; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          A
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    const destIcon = L.divIcon({
      className: 'route-dest-marker',
      html: `
        <div style="background: #10b981; color: #fff; width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          B
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    const m1 = L.marker([originPlaza.lat, originPlaza.lng], { icon: originIcon }).addTo(map);
    const m2 = L.marker([destPlaza.lat, destPlaza.lng], { icon: destIcon }).addTo(map);
    markersRef.current = [m1, m2];

    // Active selected segment polyline
    const segment = HIGHWAY_FULL_ROUTE.filter((coord) => {
      const lat = coord[0];
      const minLat = Math.min(originPlaza.lat, destPlaza.lat) - 0.05;
      const maxLat = Math.max(originPlaza.lat, destPlaza.lat) + 0.05;
      return lat >= minLat && lat <= maxLat;
    });

    const routeLine = L.polyline(segment.length > 1 ? segment : [[originPlaza.lat, originPlaza.lng], [destPlaza.lat, destPlaza.lng]], {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.9,
    }).addTo(map);
    routePolylineRef.current = routeLine;

    // Fit bounds with padding
    const group = L.featureGroup([m1, m2]);
    map.fitBounds(group.getBounds(), { padding: [30, 30] });

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

  }, [isOpen, originId, destId]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 border border-blue-500/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Map size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Expressway Trip & Real Map Route</h3>
              <p className="text-[10px] text-blue-100">Live GPS highway route, toll fees & travel estimates</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Real Leaflet Map Mini-View */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner bg-slate-100">
            <div ref={mapContainerRef} className="w-full h-full" />
            <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 text-[10px] font-bold text-gray-800 dark:text-white shadow-xs">
              🗺️ {originPlaza.name.replace(' Terminal', '').replace(' Gate', '')} ➔ {destPlaza.name.replace(' Terminal', '').replace(' Gate', '')}
            </div>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">ENTRY PLAZA (A)</label>
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
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">EXIT PLAZA (B)</label>
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
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
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

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/50 dark:border-blue-800/40 text-center">
              <div className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80">
                <Navigation size={14} className="mx-auto text-blue-500 mb-1" />
                <p className="text-[10px] text-gray-400">Distance</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white font-mono">{totalDistanceMiles} Miles</p>
              </div>

              <div className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80">
                <Clock size={14} className="mx-auto text-emerald-500 mb-1" />
                <p className="text-[10px] text-gray-400">Est. Time</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white font-mono">{estimatedDriveHours} hrs</p>
              </div>

              <div className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80">
                <Fuel size={14} className="mx-auto text-amber-500 mb-1" />
                <p className="text-[10px] text-gray-400">Est. Fuel</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white font-mono">{estimatedFuelLiters} Liters</p>
              </div>
            </div>
          </div>

          {/* Phyu 115M Rest Stop Highlight */}
          {minMile <= 115 && maxMile >= 115 && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Coffee size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">115-Mile Phyu Rest Oasis Available</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">EV Superchargers, Fuel Stations, Food Court & Prayer Rooms.</p>
              </div>
            </div>
          )}

          {/* Security & RFID Pass Notice */}
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck size={14} className="text-blue-500 shrink-0" />
            <span>RFID auto-deduct active on both Entry and Exit gantries.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            Start Navigation & Open Digital Pass
          </button>
        </div>
      </div>
    </div>
  );
}
