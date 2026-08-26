import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, X, Upload, Image, Edit, Trash2, CreditCard } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  vehicleClass: string;
  status: string;
  color?: string;
  vehiclePhoto?: string;
  wheelTaxCard?: string;
  rfidTags: Array<{ id: string; tagUid: string; status: string }>;
}

const vehicleClasses = ['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS'];

const vehicleMakes: Record<string, string[]> = {
  'Toyota': ['Corolla', 'Camry', 'Vitz', 'Yaris', 'Prius', 'Land Cruiser', 'Rush', 'Avanza', 'Innova', 'Hilux', 'Fortuner', 'Raize'],
  'Honda': ['Civic', 'City', 'Fit', 'Jazz', 'CR-V', 'HR-V', 'BR-V', 'WR-V', 'Accord', 'Brio'],
  'Nissan': ['Sunny', 'Tiida', 'Note', 'Serena', 'X-Trail', 'Juke', 'Kicks', 'Navara', 'Patrol'],
  'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-8', 'BT-50'],
  'Hyundai': ['Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Stargazer'],
  'Kia': ['Morning', 'Rio', 'Cerato', 'Sportage', 'Sorento', 'Carnival', 'Sonet'],
  'Suzuki': ['Alto', 'Swift', 'Celerio', 'Wagon R', 'Jimny', 'Ertiga', 'Vitara', 'S-Presso'],
  'Mitsubishi': ['Mirage', 'Attrage', 'Xpander', 'Outlander', 'Triton', 'Pajero Sport'],
  'Ford': ['Ranger', 'Everest', 'EcoSport', 'Explorer'],
  'Chevrolet': ['Spark', 'Cruze', 'Trailblazer', 'Colorado'],
  'MG': ['ZS', 'HS', '3', '5', 'EP', 'Marvel R'],
  'BYD': ['Atto 3', 'Dolphin', 'Seal', 'Tang', 'Song Plus'],
  'Wuling': ['Almaz', 'Cortez', 'Confero', 'Air EV', 'Bingo'],
  'Perodua': ['Myvi', 'Axia', 'Bezza', 'Ativa', 'Alza'],
  'Proton': ['Saga', 'Persona', 'Iriz', 'X50', 'X70', 'X90'],
};

const vehicleColors = [
  'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown',
  'Gold', 'Beige', 'Orange', 'Yellow', 'Navy', 'Maroon', 'Purple',
  'Pearl White', 'Metallic Gray', 'Champagne', 'Bronze', 'Cream',
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function Vehicles() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showImport, setShowImport] = useState(false);
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles', search],
    queryFn: async () => {
      const response = await api.get('/vehicles');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post('/vehicles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await api.put(`/vehicles/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setEditingVehicle(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/vehicles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const filteredVehicles = vehicles?.filter(
    (v) =>
      v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
  );

  const getPhotoUrl = (filename?: string) => {
    if (!filename) return null;
    return `${api.defaults.baseURL}/uploads/${filename}`;
  };

  const parsePhotos = (photoStr?: string): string[] => {
    if (!photoStr) return [];
    try { return JSON.parse(photoStr); } catch { return [photoStr]; }
  };

  const handleDelete = (vehicle: Vehicle) => {
    if (window.confirm(`Delete vehicle ${vehicle.plateNumber}? This cannot be undone.`)) {
      deleteMutation.mutate(vehicle.id);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowImport(true)} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700">
            <Upload size={20} /> Import CSV
          </button>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
            <Plus size={20} /> Add Vehicle
          </button>
        </div>
      </div>

      {showForm && <VehicleForm onClose={() => setShowForm(false)} onSubmit={(fd) => createMutation.mutate(fd)} />}
      {editingVehicle && <VehicleForm vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} onSubmit={(fd) => updateMutation.mutate({ id: editingVehicle.id, formData: fd })} />}
      {showImport && <CsvImportModal onClose={() => setShowImport(false)} />}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search by plate, make, or model..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Photo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Make</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Model</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Color</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Class</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">RFID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredVehicles?.map((vehicle) => {
                const photos = parsePhotos(vehicle.vehiclePhoto);
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {photos.length > 0 ? photos.map((p, i) => (
                          <img key={i} src={getPhotoUrl(p)!} alt="" className="w-8 h-8 rounded object-cover" />
                        )) : (
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center"><Image className="text-gray-400" size={14} /></div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/vehicles/${vehicle.id}`} className="text-blue-600 hover:underline font-medium">{vehicle.plateNumber}</Link>
                    </td>
                    <td className="px-4 py-3 text-sm">{vehicle.make}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.model}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.color || '-'}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-full bg-gray-100">{vehicle.vehicleClass}</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{vehicle.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {vehicle.rfidTags?.length > 0 ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-mono">{vehicle.rfidTags[0].tagUid.slice(0, 8)}...</span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setEditingVehicle(vehicle)} className="p-1 text-gray-500 hover:text-blue-600 rounded" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(vehicle)} className="p-1 text-gray-500 hover:text-red-600 rounded" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredVehicles?.length === 0 && <div className="p-8 text-center text-gray-500">No vehicles found</div>}
      </div>
    </div>
  );
}

function VehicleForm({ vehicle, onClose, onSubmit }: { vehicle?: Vehicle; onClose: () => void; onSubmit: (fd: FormData) => void }) {
  const [plateNumber, setPlateNumber] = useState(vehicle?.plateNumber || '');
  const [make, setMake] = useState(vehicle?.make || '');
  const [model, setModel] = useState(vehicle?.model || '');
  const [year, setYear] = useState(vehicle?.year?.toString() || currentYear.toString());
  const [color, setColor] = useState(vehicle?.color || '');
  const [vehicleClass, setVehicleClass] = useState(vehicle?.vehicleClass || 'SEDAN');
  const [rfidTagUid, setRfidTagUid] = useState('');

  const [vehiclePhotos, setVehiclePhotos] = useState<(File | null)[]>([null, null]);
  const [wheelTaxCards, setWheelTaxCards] = useState<(File | null)[]>([null, null]);
  const [vehiclePreviews, setVehiclePreviews] = useState<(string | null)[]>([null, null]);
  const [taxPreviews, setTaxPreviews] = useState<(string | null)[]>([null, null]);

  const existingVehiclePhotos = vehicle ? (() => { try { return JSON.parse(vehicle.vehiclePhoto || '[]'); } catch { return vehicle.vehiclePhoto ? [vehicle.vehiclePhoto] : []; } })() : [];
  const existingTaxPhotos = vehicle ? (() => { try { return JSON.parse(vehicle.wheelTaxCard || '[]'); } catch { return vehicle.wheelTaxCard ? [vehicle.wheelTaxCard] : []; } })() : [];

  const availableModels = make ? (vehicleMakes[make] || []) : [];

  const handleFileChange = (file: File | null, type: 'vehicle' | 'tax', index: number) => {
    if (type === 'vehicle') {
      const newPhotos = [...vehiclePhotos];
      newPhotos[index] = file;
      setVehiclePhotos(newPhotos);
      const newPreviews = [...vehiclePreviews];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { const p = [...vehiclePreviews]; p[index] = e.target?.result as string; setVehiclePreviews(p); };
        reader.readAsDataURL(file);
      } else {
        newPreviews[index] = null;
        setVehiclePreviews(newPreviews);
      }
    } else {
      const newCards = [...wheelTaxCards];
      newCards[index] = file;
      setWheelTaxCards(newCards);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => { const p = [...taxPreviews]; p[index] = e.target?.result as string; setTaxPreviews(p); };
        reader.readAsDataURL(file);
      } else {
        const newPreviews = [...taxPreviews];
        newPreviews[index] = null;
        setTaxPreviews(newPreviews);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('plateNumber', plateNumber);
    fd.append('make', make);
    fd.append('model', model);
    fd.append('year', year);
    fd.append('color', color);
    fd.append('vehicleClass', vehicleClass);
    if (rfidTagUid.trim()) fd.append('rfidTagUid', rfidTagUid.trim());
    vehiclePhotos.forEach((f) => { if (f) fd.append('vehiclePhoto', f); });
    wheelTaxCards.forEach((f) => { if (f) fd.append('wheelTaxCard', f); });
    onSubmit(fd);
  };

  const PhotoUpload = ({ label, previews, existing, onChange, type }: { label: string; previews: (string | null)[]; existing: string[]; onChange: (file: File | null, type: 'vehicle' | 'tax', index: number) => void; type: 'vehicle' | 'tax' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map((i) => {
          const preview = previews[i];
          const exist = existing[i];
          return (
            <label key={i} className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 cursor-pointer hover:bg-gray-50 min-h-[100px]">
              {preview ? (
                <img src={preview} alt="" className="w-full h-20 object-cover rounded" />
              ) : exist ? (
                <img src={`${api.defaults.baseURL}/uploads/${exist}`} alt="" className="w-full h-20 object-cover rounded" />
              ) : (
                <>
                  <Upload className="text-gray-400 mb-1" size={18} />
                  <span className="text-xs text-gray-500">Photo {i + 1}</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null, type, i)} />
            </label>
          );
        })}
      </div>
      {(previews.some(Boolean) || existing.some(Boolean)) && (
        <button type="button" onClick={() => { if (type === 'vehicle') { setVehiclePhotos([null, null]); setVehiclePreviews([null, null]); } else { setWheelTaxCards([null, null]); setTaxPreviews([null, null]); } }}
          className="text-xs text-red-600 mt-1">Remove all</button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">{vehicle ? 'Edit Vehicle' : 'Register New Vehicle'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
              <input type="text" required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1A-1234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <select required value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <select required value={make} onChange={(e) => { setMake(e.target.value); setModel(''); }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Make</option>
                {Object.keys(vehicleMakes).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <select required value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                <option value="">{make ? 'Select Model' : 'Select Make first'}</option>
                {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <select value={color} onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Color</option>
                {vehicleColors.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Class *</label>
              <select value={vehicleClass} onChange={(e) => setVehicleClass(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {vehicleClasses.map((vc) => <option key={vc} value={vc}>{vc}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-blue-600" />
              <h3 className="font-medium text-sm text-gray-700">RFID Tag</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RFID Tag UID</label>
              <input type="text" value={rfidTagUid} onChange={(e) => setRfidTagUid(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" placeholder="e.g. E2801160116012345" />
              <p className="text-xs text-gray-400 mt-1">Scan or enter the RFID tag UID to bind to this vehicle</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <PhotoUpload label="Vehicle Photos (up to 2)" previews={vehiclePreviews} existing={existingVehiclePhotos} onChange={handleFileChange} type="vehicle" />
            <PhotoUpload label="Wheel Tax Card Photos (up to 2)" previews={taxPreviews} existing={existingTaxPhotos} onChange={handleFileChange} type="tax" />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {vehicle ? 'Save Changes' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CsvImportModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const queryClient = useQueryClient();

  const handleUpload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const response = await api.post('/vehicles/import/csv', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setResult(response.data);
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Import Vehicles from CSV</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        {!result ? (
          <>
            <p className="text-sm text-gray-600 mb-4">CSV format: <code>plateNumber,make,model,year,color,vehicleClass</code></p>
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full mb-4" />
            <button onClick={handleUpload} disabled={!file} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">Import</button>
          </>
        ) : (
          <div>
            <p className="text-green-600 font-medium mb-2">Imported {result.imported} vehicles</p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-red-600 font-medium mb-1">Errors:</p>
                <ul className="text-sm text-red-600 max-h-40 overflow-y-auto">{result.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            )}
            <button onClick={onClose} className="w-full mt-4 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
