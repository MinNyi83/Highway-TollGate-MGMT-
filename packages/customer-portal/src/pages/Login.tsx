import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/api';
import { Car, LogIn, User, Building2, Phone, MapPin, CreditCard } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [customerType, setCustomerType] = useState<'INDIVIDUAL' | 'ENTERPRISE'>('INDIVIDUAL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nrcNumber, setNrcNumber] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyRegNo, setCompanyRegNo] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [fleetManagerName, setFleetManagerName] = useState('');
  const [smsProvider, setSmsProvider] = useState('mpt');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        const response = await api.post('/customer/register', {
          email, password, name, customerType,
          phone, nrcNumber, drivingLicense,
          companyName, companyRegNo, companyAddress, fleetManagerName,
          smsProvider, smsEnabled,
        });
        login(response.data.token, response.data.user);
      } else {
        const response = await api.post('/customer/login', { email, password });
        login(response.data.token, response.data.user);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Car className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TollGate</h1>
          <p className="text-gray-500">{isRegister ? 'Create Account' : 'Customer Portal'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">{error}</div>
          )}

          {isRegister && (
            <>
              {/* Customer Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomerType('INDIVIDUAL')}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 ${
                      customerType === 'INDIVIDUAL'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User size={20} />
                    <span className="text-sm font-medium">Individual</span>
                    <span className="text-xs text-gray-500">Personal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerType('ENTERPRISE')}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 ${
                      customerType === 'ENTERPRISE'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 size={20} />
                    <span className="text-sm font-medium">Enterprise</span>
                    <span className="text-xs text-gray-500">Company</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="09-XXXXXXXX"
                  />
                </div>
              </div>

              {/* Individual Fields */}
              {customerType === 'INDIVIDUAL' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NRC Number *</label>
                    <input
                      type="text"
                      required
                      value={nrcNumber}
                      onChange={(e) => setNrcNumber(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12/XXXX(N)XXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driving License</label>
                    <input
                      type="text"
                      value={drivingLicense}
                      onChange={(e) => setDrivingLicense(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="License number"
                    />
                  </div>
                </>
              )}

              {/* Enterprise Fields */}
              {customerType === 'ENTERPRISE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Registration No *</label>
                    <input
                      type="text"
                      required
                      value={companyRegNo}
                      onChange={(e) => setCompanyRegNo(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Registration number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Address"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Manager Name</label>
                    <input
                      type="text"
                      value={fleetManagerName}
                      onChange={(e) => setFleetManagerName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Fleet manager"
                    />
                  </div>
                </>
              )}

              {/* SMS Settings */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                  <button
                    type="button"
                    onClick={() => setSmsEnabled(!smsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      smsEnabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      smsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                {smsEnabled && (
                  <select
                    value={smsProvider}
                    onChange={(e) => setSmsProvider(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="mpt">MPT</option>
                    <option value="atom">Atom</option>
                    <option value="u9">U9</option>
                    <option value="mytel">Mytel</option>
                  </select>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-blue-600 hover:underline ml-1"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>

        {!isRegister && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Individual & Enterprise accounts supported
          </p>
        )}
      </div>
    </div>
  );
}
