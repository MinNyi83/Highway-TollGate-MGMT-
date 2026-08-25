import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Search, X, Upload, Image } from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  vehicleClass: string;
  status: string;
  vehiclePhoto?: string;
  wheelTaxCard?: string;
  rfidTags: Array<{ id: string; tagUid: string; status: string }>;
}

const vehicleClasses = ['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS'];

export default function Vehicles() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
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

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {showForm && <AddVehicleForm onClose={() => setShowForm(false)} onSubmit={(fd) => createMutation.mutate(fd)} />}

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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plate Number</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Make</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Model</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Class</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tax Card</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">RFID</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredVehicles?.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {vehicle.vehiclePhoto ? (
                    <img src={getPhotoUrl(vehicle.vehiclePhoto)!} alt="Vehicle" className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                      <Image className="text-gray-400" size={20} />
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
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Uploaded</span>
                  ) : (
                    <span className="text-gray-400 text-xs">None</span>
                  )}
                </td>
                <td className="px-4 py-3">{vehicle.rfidTags?.length || 0}</td>
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

function AddVehicleForm({ onClose, onSubmit }: { onClose: () => void; onSubmit: (fd: FormData) => void }) {
  const [plateNumber, setPlateNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [color, setColor] = useState('');
  const [vehicleClass, setVehicleClass] = useState('SEDAN');
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [wheelTaxCard, setWheelTaxCard] = useState<File | null>(null);
  const [vehiclePreview, setVehiclePreview] = useState<string | null>(null);
  const [taxPreview, setTaxPreview] = useState<string | null>(null);

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
          <h2 className="text-lg font-bold">Register New Vehicle</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
              <input type="text" required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="ABC-1234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input type="number" required value={year} onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
              <input type="text" required value={make} onChange={(e) => setMake(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Toyota" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input type="text" required value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Camry" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Red" />
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
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                {vehiclePreview ? (
                  <img src={vehiclePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Click to upload</span>
                    <span className="text-xs text-gray-400">JPEG, PNG, WEBP (max 10MB)</span>
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
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                {taxPreview ? (
                  <img src={taxPreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">Click to upload</span>
                    <span className="text-xs text-gray-400">JPEG, PNG, WEBP (max 10MB)</span>
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
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Register Vehicle</button>
          </div>
        </form>
      </div>
    </div>
  );
}
