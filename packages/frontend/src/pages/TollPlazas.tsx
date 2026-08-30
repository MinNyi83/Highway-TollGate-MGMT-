import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus, X, Pencil, Trash2, Eye, MapPin, Cpu, Map as MapIcon, LayoutGrid } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HIGHWAY_ROUTE_COORDINATES } from '../components/command-hub/PlazaMapModal';

interface TollPlaza {
  id: string;
  name: string;
  gateCode: string | null;
  locationLat: number;
  locationLng: number;
  mileMarker: number | null;
  lanes: number;
  status: string;
  tollRates: Array<{ id: string; vehicleClass: string; rateAmount: number }>;
  deviceStatuses?: Array<{ id: string; deviceType: string; status: string }>;
}

interface PlazaForm {
  name: string;
  gateCode: string;
  locationLat: string;
  locationLng: string;
  mileMarker: string;
  lanes: string;
  status: string;
}

const emptyForm: PlazaForm = { name: '', gateCode: '', locationLat: '', locationLng: '', mileMarker: '', lanes: '4', status: 'ACTIVE' };

export default function TollPlazas() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingPlaza, setEditingPlaza] = useState<TollPlaza | null>(null);
  const [form, setForm] = useState<PlazaForm>(emptyForm);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: plazas, isLoading } = useQuery<TollPlaza[]>({
    queryKey: ['toll-plazas'],
    queryFn: async () => {
      const response = await api.get('/toll-plazas');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PlazaForm) => {
      return api.post('/toll-plazas', {
        name: data.name,
        gateCode: data.gateCode || undefined,
        locationLat: parseFloat(data.locationLat),
        locationLng: parseFloat(data.locationLng),
        mileMarker: data.mileMarker ? parseInt(data.mileMarker) : undefined,
        lanes: parseInt(data.lanes) || 4,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plazas'] });
      closeModal();
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to create plaza'),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: PlazaForm & { id: string }) => {
      return api.put(`/toll-plazas/${data.id}`, {
        name: data.name,
        gateCode: data.gateCode || undefined,
        locationLat: parseFloat(data.locationLat),
        locationLng: parseFloat(data.locationLng),
        mileMarker: data.mileMarker ? parseInt(data.mileMarker) : undefined,
        lanes: parseInt(data.lanes) || 4,
        status: data.status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plazas'] });
      closeModal();
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Failed to update plaza'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/toll-plazas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toll-plazas'] });
      setDeleteConfirm(null);
    },
  });

  const openCreate = () => {
    setEditingPlaza(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (plaza: TollPlaza) => {
    setEditingPlaza(plaza);
    setForm({
      name: plaza.name,
      gateCode: plaza.gateCode || '',
      locationLat: String(plaza.locationLat),
      locationLng: String(plaza.locationLng),
      mileMarker: plaza.mileMarker != null ? String(plaza.mileMarker) : '',
      lanes: String(plaza.lanes),
      status: plaza.status,
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlaza(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!form.locationLat || !form.locationLng) { setError('Location coordinates are required'); return; }
    if (editingPlaza) {
      updateMutation.mutate({ ...form, id: editingPlaza.id });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleChange = (field: keyof PlazaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div className="text-center py-8 text-slate-500 font-medium">Loading Toll Plazas...</div>;

  return (
    <div>
      {/* Header and View Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Toll Plazas</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage highway plazas, lane controllers, and GPS geofences</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-300/60 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid size={15} /> Grid Cards
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapIcon size={15} /> 🗺️ Real Map View
            </button>
          </div>

          <button onClick={openCreate} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition-colors text-sm">
            <Plus size={18} /> Add Plaza
          </button>
        </div>
      </div>

      {/* Conditional Rendering: Real Map View vs Grid Cards */}
      {viewMode === 'map' ? (
        <RealPlazasMapView plazas={plazas || []} onEdit={openEdit} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plazas?.map((plaza) => {
            const devices = plaza.deviceStatuses || [];
            const online = devices.filter((d) => d.status === 'ONLINE').length;
            const offline = devices.filter((d) => d.status === 'OFFLINE' || d.status === 'ERROR').length;

            return (
              <div key={plaza.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Link to={`/toll-plazas/${plaza.id}`} className="text-lg font-bold text-brand-600 dark:text-cyan-400 hover:underline">
                      {plaza.name}
                    </Link>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      plaza.status === 'ACTIVE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-crimson-50 dark:bg-crimson-950/40 text-crimson-600 dark:text-crimson-400 border border-crimson-200 dark:border-crimson-800/60'
                    }`}>
                      {plaza.status}
                    </span>
                  </div>
                  {plaza.gateCode && (
                    <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">Gate Code: {plaza.gateCode}</p>
                  )}
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mb-1 font-mono">
                    <MapPin size={13} className="text-brand-500 dark:text-cyan-400" /> {plaza.locationLat}, {plaza.locationLng}
                  </p>
                  {plaza.mileMarker != null && (
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Mile Marker: <span className="font-semibold text-slate-800 dark:text-slate-200">{plaza.mileMarker}M</span></p>
                  )}
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">Total Lanes: <span className="font-semibold text-slate-800 dark:text-slate-200">{plaza.lanes} Active</span></p>

                  {devices.length > 0 && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <Cpu size={14} className="text-brand-500 dark:text-cyan-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{online} online</span>
                      {offline > 0 && <span className="text-crimson-600 dark:text-crimson-400 font-semibold ml-1">{offline} offline</span>}
                    </p>
                  )}

                  {plaza.tollRates?.length > 0 && (
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mb-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Toll Rates (MMK)</h4>
                      <div className="space-y-1">
                        {plaza.tollRates.map((rate) => (
                          <div key={rate.id} className="flex justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-400">{rate.vehicleClass}</span>
                            <span className="font-mono font-semibold text-slate-900 dark:text-white">{Number(rate.rateAmount).toLocaleString()} MMK</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex gap-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                    <Link to={`/toll-plazas/${plaza.id}`} className="flex-1 text-center text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-colors">
                      <Eye size={14} /> View
                    </Link>
                    <button onClick={() => openEdit(plaza)} className="flex-1 text-center text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-cyan-300 px-3 py-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-colors">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(plaza.id)} className="flex-1 text-center text-xs bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-700 dark:text-crimson-300 px-3 py-2 rounded-xl font-medium flex items-center justify-center gap-1 transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>

                  {deleteConfirm === plaza.id && (
                    <div className="mt-3 bg-crimson-500/10 border border-crimson-500/30 rounded-xl p-3">
                      <p className="text-xs text-crimson-600 dark:text-crimson-400 font-semibold mb-2">Delete "{plaza.name}"? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg py-1 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                        <button onClick={() => deleteMutation.mutate(plaza.id)} disabled={deleteMutation.isPending} className="flex-1 text-xs bg-crimson-600 text-white rounded-lg py-1 hover:bg-crimson-500 font-semibold disabled:opacity-50">
                          {deleteMutation.isPending ? 'Deleting...' : 'Confirm'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {plazas?.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 font-medium">No toll plazas found</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-4 text-slate-900 dark:text-white">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold">{editingPlaza ? 'Edit Toll Plaza' : 'Add Toll Plaza'}</h2>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-crimson-500/10 border border-crimson-500/30 text-crimson-600 dark:text-crimson-400 px-3 py-2 rounded-xl text-xs font-semibold">{error}</div>}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Yangon Toll Gate" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gate Code</label>
                <input type="text" value={form.gateCode} onChange={(e) => handleChange('gateCode', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. YGN-01" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Latitude *</label>
                  <input type="number" step="any" value={form.locationLat} onChange={(e) => handleChange('locationLat', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="17.0372" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Longitude *</label>
                  <input type="number" step="any" value={form.locationLng} onChange={(e) => handleChange('locationLng', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="96.1788" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mile Marker</label>
                  <input type="number" value={form.mileMarker} onChange={(e) => handleChange('mileMarker', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Lanes</label>
                  <input type="number" min="1" max="20" value={form.lanes} onChange={(e) => handleChange('lanes', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {editingPlaza && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold disabled:opacity-50 shadow-sm">
                  {editingPlaza ? (updateMutation.isPending ? 'Saving...' : 'Save Changes') : (createMutation.isPending ? 'Adding...' : 'Add Plaza')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Dedicated Real Map View Component for TollPlazas
function RealPlazasMapView({ plazas }: { plazas: TollPlaza[]; onEdit?: (plaza: TollPlaza) => void }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [19.5, 96.2],
        zoom: 7,
        zoomControl: true,
      });

      // CartoDB Dark layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18,
      }).addTo(map);

      // Route polyline
      const polyline = L.polyline(HIGHWAY_ROUTE_COORDINATES, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.85,
      }).addTo(map);

      // Plot all plazas
      const markers: L.Marker[] = [];
      plazas.forEach((plaza) => {
        const lat = plaza.locationLat || 17.0372;
        const lng = plaza.locationLng || 96.1788;
        const isOnline = plaza.status === 'ACTIVE';
        const color = isOnline ? '#10b981' : '#f59e0b';

        const customIcon = L.divIcon({
          className: 'custom-plaza-marker',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; cursor: pointer;">
              <span style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${color}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0, 0.2) infinite;"></span>
              <div style="position: relative; width: 30px; height: 30px; border-radius: 50%; background: #0f172a; border: 2.5px solid ${color}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; font-family: monospace; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
                ${plaza.mileMarker != null ? `${plaza.mileMarker}M` : 'GATE'}
              </div>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 170px; padding: 2px;">
            <div style="font-weight: bold; font-size: 13px; color: #0f172a;">${plaza.name}</div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Gate Code: ${plaza.gateCode || 'N/A'} • ${plaza.lanes} Lanes</div>
            <div style="font-size: 11px; font-weight: bold; color: ${isOnline ? '#166534' : '#92400e'};">${plaza.status}</div>
          </div>
        `);
        markers.push(marker);
      });

      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
      } else {
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      }

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [plazas]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-brand-600 dark:text-cyan-400" size={18} />
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Yangon – Mandalay Corridor Live GPS Plot</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing {plazas.length} Toll Gate Coordinates along Highway 1
        </span>
      </div>

      <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
