import { useState, useEffect, useRef } from 'react';
import { MapPin, XCircle, Radio, ShieldCheck, ZoomIn, ZoomOut, Compass } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface PlazaNode {
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
  lat: number;
  lng: number;
}

export const HIGHWAY_PLAZAS: PlazaNode[] = [
  {
    id: 'plaza-001',
    name: 'Yangon 0-Mile Plaza',
    code: '0MILE',
    mile: 0,
    location: 'Yangon Main Terminal (Mingaladon / Hlegu)',
    status: 'ONLINE',
    activeLanes: 6,
    totalLanes: 6,
    todayVehicles: 4820,
    todayRevenue: 9640000,
    lat: 17.0372,
    lng: 96.1788,
  },
  {
    id: 'plaza-002',
    name: 'Bago Junction Plaza',
    code: 'BAGO39',
    mile: 39,
    location: 'Bago Bypass Entry & Highway Junction',
    status: 'ONLINE',
    activeLanes: 4,
    totalLanes: 4,
    todayVehicles: 3210,
    todayRevenue: 6420000,
    lat: 17.3353,
    lng: 96.4817,
  },
  {
    id: 'plaza-003',
    name: 'Phyu Rest Stop Plaza',
    code: 'PHYU115',
    mile: 115,
    location: 'Phyu 115M Oasis & Commercial Rest Plaza',
    status: 'ONLINE',
    activeLanes: 4,
    totalLanes: 4,
    todayVehicles: 2780,
    todayRevenue: 5560000,
    lat: 18.5284,
    lng: 96.4385,
  },
  {
    id: 'plaza-004',
    name: 'Naypyitaw Capital Plaza',
    code: 'NPT201',
    mile: 201,
    location: 'Naypyitaw Southern Expressway Gate',
    status: 'ONLINE',
    activeLanes: 6,
    totalLanes: 6,
    todayVehicles: 4150,
    todayRevenue: 8300000,
    lat: 19.7450,
    lng: 96.1297,
  },
  {
    id: 'plaza-005',
    name: 'Meiktila Junction Plaza',
    code: 'MEIK285',
    mile: 285,
    location: 'Meiktila Highway Crossroads',
    status: 'WARNING',
    activeLanes: 3,
    totalLanes: 4,
    todayVehicles: 1950,
    todayRevenue: 3900000,
    lat: 20.8762,
    lng: 95.8611,
  },
  {
    id: 'plaza-006',
    name: 'Mandalay Toll Plaza',
    code: 'MDY352',
    mile: 352,
    location: 'Mandalay Southern Terminal Gate',
    status: 'ONLINE',
    activeLanes: 6,
    totalLanes: 6,
    todayVehicles: 5320,
    todayRevenue: 10640000,
    lat: 21.9750,
    lng: 96.0836,
  },
];

// Actual path coordinates along Yangon-Mandalay Expressway (Highway 1)
export const HIGHWAY_ROUTE_COORDINATES: [number, number][] = [
  [17.0372, 96.1788], // 0-Mile Yangon
  [17.1500, 96.2500],
  [17.3353, 96.4817], // 39-Mile Bago
  [17.6500, 96.5200],
  [17.9800, 96.4900], // Nyaunglebin
  [18.2500, 96.4600],
  [18.5284, 96.4385], // 115-Mile Phyu
  [18.9000, 96.3800], // Taungoo
  [19.3000, 96.2500],
  [19.7450, 96.1297], // 201-Mile Naypyitaw
  [20.1500, 96.0200], // Tatkon
  [20.5500, 95.9200], // Yamethin
  [20.8762, 95.8611], // 285-Mile Meiktila
  [21.2000, 95.9200], // Kyaukse
  [21.6000, 96.0200],
  [21.9750, 96.0836], // 352-Mile Mandalay
];

interface PlazaMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlazaMapModal({ isOpen, onClose }: PlazaMapModalProps) {
  const [selectedPlaza, setSelectedPlaza] = useState<PlazaNode | null>(HIGHWAY_PLAZAS[0]);
  const [mapStyle, setMapStyle] = useState<'dark' | 'streets' | 'satellite'>('dark');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Initialize Leaflet Map if not already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.5, 96.2],
        zoom: 7,
        zoomControl: false,
      });

      // Add default tile layer
      const tileUrl = getTileUrl(mapStyle);
      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Draw Expressway Polyline
      const polyline = L.polyline(HIGHWAY_ROUTE_COORDINATES, {
        color: '#06b6d4',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '10, 8',
      }).addTo(map);

      // Add custom pulse markers for each plaza
      HIGHWAY_PLAZAS.forEach((plaza) => {
        const isOnline = plaza.status === 'ONLINE';
        const color = isOnline ? '#10b981' : '#f59e0b';
        
        const customIcon = L.divIcon({
          className: 'custom-plaza-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; cursor: pointer;">
              <span style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${color}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: #0f172a; border: 2.5px solid ${color}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px; font-family: monospace; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                ${plaza.mile}M
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([plaza.lat, plaza.lng], { icon: customIcon }).addTo(map);
        
        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 2px; color: #0f172a;">${plaza.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Mile Marker ${plaza.mile}M • ${plaza.code}</div>
            <div style="display: flex; gap: 6px; font-size: 11px;">
              <span style="background: ${isOnline ? '#dcfce7' : '#fef3c7'}; color: ${isOnline ? '#166534' : '#92400e'}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${plaza.status}</span>
              <span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${plaza.activeLanes}/${plaza.totalLanes} Lanes</span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedPlaza(plaza);
        });

        markersRef.current[plaza.id] = marker;
      });

      // Fit map to route bounds
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      mapInstanceRef.current = map;
    } else {
      // If already initialized, invalidate size so tiles render immediately
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update tile style
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newLayer = L.tileLayer(getTileUrl(mapStyle), {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO &copy; Esri',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapStyle]);

  // Pan to selected plaza
  const handlePlazaSelect = (plaza: PlazaNode) => {
    setSelectedPlaza(plaza);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([plaza.lat, plaza.lng], 11, {
        duration: 1.2,
      });
      const marker = markersRef.current[plaza.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(HIGHWAY_ROUTE_COORDINATES);
      mapInstanceRef.current.flyToBounds(bounds, { padding: [40, 40], duration: 1 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl w-full max-w-6xl h-[88vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
              <MapPin className="text-cyan-400" size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                Yangon – Mandalay Expressway (Highway 1) Live Map
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  REAL-TIME GPS TELEMETRY
                </span>
              </h3>
              <p className="text-xs text-slate-400">Interactive geographic route spanning 352 Miles with 6 Connected Toll Plazas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Map Layer Selector */}
            <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
              <button
                onClick={() => setMapStyle('dark')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  mapStyle === 'dark' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark Mode
              </button>
              <button
                onClick={() => setMapStyle('streets')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  mapStyle === 'streets' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Street Map
              </button>
              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  mapStyle === 'satellite' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors ml-2"
              title="Close Map"
            >
              <XCircle size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          
          {/* Real Leaflet Map Container (2 cols) */}
          <div className="lg:col-span-2 relative h-full min-h-[460px] bg-slate-950">
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Floating Map Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="w-9 h-9 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 rounded-xl flex items-center justify-center shadow-lg transition-all"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="w-9 h-9 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 rounded-xl flex items-center justify-center shadow-lg transition-all"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={handleResetView}
                className="w-9 h-9 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-all"
                title="Fit Whole Highway Route"
              >
                <Compass size={18} />
              </button>
            </div>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs space-y-1.5 text-slate-300 shadow-xl">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Highway 1 Network Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Online & Synchronized (5 Plazas)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Warning / Lane Maintenance (1 Plaza)</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px] text-cyan-400 font-mono">
                <span>Total Corridor Length: 352.0 Miles</span>
              </div>
            </div>
          </div>

          {/* Plaza Inspector Sidebar (1 col) */}
          <div className="p-5 bg-slate-900 border-l border-slate-800 flex flex-col justify-between overflow-y-auto space-y-4">
            
            <div>
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                Highway Toll Plazas
              </h4>

              {/* Plaza List Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {HIGHWAY_PLAZAS.map((p) => {
                  const isSelected = selectedPlaza?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePlazaSelect(p)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md ring-2 ring-cyan-500/20'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-400">{p.mile}M</span>
                        <span className={`w-2 h-2 rounded-full ${p.status === 'ONLINE' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      </div>
                      <div className="text-xs font-semibold truncate mt-0.5">{p.name.replace(' Plaza', '').replace(' Toll', '')}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Plaza Detailed Telemetry Card */}
              {selectedPlaza && (
                <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3.5 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                        PLAZA ID: {selectedPlaza.code}
                      </span>
                      <h4 className="font-bold text-white text-base leading-tight mt-0.5">{selectedPlaza.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedPlaza.location}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedPlaza.status === 'ONLINE' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {selectedPlaza.status}
                    </span>
                  </div>

                  {/* GPS Coordinate Pill */}
                  <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl text-xs font-mono text-slate-300 border border-slate-700/50">
                    <Compass size={14} className="text-cyan-400 shrink-0" />
                    <span>GPS: {selectedPlaza.lat.toFixed(4)}° N, {selectedPlaza.lng.toFixed(4)}° E</span>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      <p className="text-[11px] text-slate-400">Active Lanes</p>
                      <p className="text-lg font-mono font-bold text-white mt-0.5">
                        {selectedPlaza.activeLanes} <span className="text-xs text-slate-500">/ {selectedPlaza.totalLanes}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      <p className="text-[11px] text-slate-400">Mile Marker</p>
                      <p className="text-lg font-mono font-bold text-cyan-400 mt-0.5">
                        {selectedPlaza.mile}.0 <span className="text-xs text-slate-500">Miles</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      <p className="text-[11px] text-slate-400">Today's Traffic</p>
                      <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                        {selectedPlaza.todayVehicles.toLocaleString()} <span className="text-[10px] text-slate-500">v/day</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                      <p className="text-[11px] text-slate-400">Today's Revenue</p>
                      <p className="text-sm font-mono font-bold text-white mt-1">
                        K{(selectedPlaza.todayRevenue / 1000000).toFixed(2)}M <span className="text-[10px] text-slate-500">MMK</span>
                      </p>
                    </div>
                  </div>

                  {/* Hardware & Sync Health */}
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Radio size={13} className="text-cyan-400" /> RFID Readers
                      </span>
                      <span className="text-emerald-400 font-semibold font-mono">100% Operational</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-400" /> ANPR Optical Cameras
                      </span>
                      <span className="text-emerald-400 font-semibold font-mono">Synced (<span className="text-cyan-300">&lt;65ms</span>)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={handleResetView}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all text-center"
              >
                Fit Route
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition-all text-center"
              >
                Done
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

function getTileUrl(style: 'dark' | 'streets' | 'satellite'): string {
  switch (style) {
    case 'dark':
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    case 'streets':
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    case 'satellite':
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }
}
