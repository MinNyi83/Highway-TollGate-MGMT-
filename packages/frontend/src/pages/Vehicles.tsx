import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, X, Upload, Image, Edit, Trash2 } from 'lucide-react';

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

  const handleDelete = (vehicle: Vehicle) => {
    if (window.confirm(`Delete vehicle ${vehicle.plateNumber}? This cannot be undone.`)) {
      deleteMutation.mutate(vehicle.id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
          >
            <Upload size={20} />
            Import CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        </div>
      </div>

      {showForm && (
        <VehicleForm
          onClose={() => setShowForm(false)}
          onSubmit={(fd) => createMutation.mutate(fd)}
        />
      )}

      {editingVehicle && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => setEditingVehicle(null)}
          onSubmit={(fd) => updateMutation.mutate({ id: editingVehicle.id, formData: fd })}
        />
      )}

      {showImport && <CsvImportModal onClose={() => setShowImport(false)} />}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by plate, make, or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Photo</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plate</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Make</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Model</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Class</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tax</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">RFID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredVehicles?.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {vehicle.vehiclePhoto ? (
                    <img src={getPhotoUrl(vehicle.vehiclePhoto)!} alt="" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                      <Image className="text-gray-400" size={16} />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link to={`/vehicles/${vehicle.id}`} className="text-blue-600 hover:underline font-medium">
                    {vehicle.plateNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{vehicle.make}</td>
                <td className="px-4 py-3">{vehicle.model}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{vehicle.vehicleClass}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {vehicle.wheelTaxCard ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Yes</span>
                  ) : (
                    <span className="text-gray-400 text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-3">{vehicle.rfidTags?.length || 0}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingVehicle(vehicle)}
                      className="p-1 text-gray-500 hover:text-blue-600 rounded"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(vehicle)}
                      className="p-1 text-gray-500 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVehicles?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No vehicles found</div>
        )}
      </div>
    </div>
  );
}

function VehicleForm({
  vehicle,
  onClose,
  onSubmit,
}: {
  vehicle?: Vehicle;
  onClose: () => void;
  onSubmit: (fd: FormData) => void;
}) {
  const [plateNumber, setPlateNumber] = useState(vehicle?.plateNumber || '');
  const [make, setMake] = useState(vehicle?.make || '');
  const [model, setModel] = useState(vehicle?.model || '');
  const [year, setYear] = useState(vehicle?.year?.toString() || currentYear.toString());
  const [color, setColor] = useState(vehicle?.color || '');
  const [vehicleClass, setVehicleClass] = useState(vehicle?.vehicleClass || 'SEDAN');
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [wheelTaxCard, setWheelTaxCard] = useState<File | null>(null);
  const [vehiclePreview, setVehiclePreview] = useState<string | null>(
    vehicle?.vehiclePhoto ? `${api.defaults.baseURL}/uploads/${vehicle.vehiclePhoto}` : null
  );
  const [taxPreview, setTaxPreview] = useState<string | null>(
    vehicle?.wheelTaxCard ? `${api.defaults.baseURL}/uploads/${vehicle.wheelTaxCard}` : null
  );

  const availableModels = make ? (vehicleMakes[make] || []) : [];

  const handleFileChange = (file: File | null, type: 'vehicle' | 'tax') => {
    if (type === 'vehicle') {
      setVehiclePhoto(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setVehiclePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setVehiclePreview(null);
      }
    } else {
      setWheelTaxCard(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setTaxPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setTaxPreview(null);
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
    if (vehiclePhoto) fd.append('vehiclePhoto', vehiclePhoto);
    if (wheelTaxCard) fd.append('wheelTaxCard', wheelTaxCard);
    onSubmit(fd);
  };

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Photo</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50 min-h-[140px]">
                {vehiclePreview ? (
                  <img src={vehiclePreview} alt="Preview" className="w-full h-28 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Click to upload</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'vehicle')} />
              </label>
              {vehiclePreview && (
                <button type="button" onClick={() => handleFileChange(null, 'vehicle')} className="text-xs text-red-600 mt-1">Remove</button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Tax Card</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50 min-h-[140px]">
                {taxPreview ? (
                  <img src={taxPreview} alt="Preview" className="w-full h-28 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Click to upload</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] || null, 'tax')} />
              </label>
              {taxPreview && (
                <button type="button" onClick={() => handleFileChange(null, 'tax')} className="text-xs text-red-600 mt-1">Remove</button>
              )}
            </div>
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
    const response = await api.post('/vehicles/import/csv', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
            <p className="text-sm text-gray-600 mb-4">
              CSV format: <code>plateNumber,make,model,year,color,vehicleClass</code>
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full mb-4"
            />
            <button
              onClick={handleUpload}
              disabled={!file}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Import
            </button>
          </>
        ) : (
          <div>
            <p className="text-green-600 font-medium mb-2">Imported {result.imported} vehicles</p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-red-600 font-medium mb-1">Errors:</p>
                <ul className="text-sm text-red-600 max-h-40 overflow-y-auto">
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}
            <button onClick={onClose} className="w-full mt-4 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
