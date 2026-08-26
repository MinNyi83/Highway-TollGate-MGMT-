import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Edit, Trash2, X, User, Building2, Wallet, Ban, CheckCircle, Key, ArrowUpRight } from 'lucide-react';
import api from '../lib/api';

interface Customer {
  id: string;
  email: string;
  name: string;
  role: string;
  customerType: string;
  phone?: string;
  nrcNumber?: string;
  drivingLicense?: string;
  companyName?: string;
  companyRegNo?: string;
  companyAddress?: string;
  fleetManagerName?: string;
  createdAt: string;
  accounts: {
    id: string;
    accountNumber?: string;
    balance: number;
    status: string;
    rfidTags: any[];
  }[];
}

export default function Customers() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ['admin-customers', search],
    queryFn: async () => {
      const config = search ? { params: { search } } : undefined;
      const r = await api.get('/admin/customers', config);
      return Array.isArray(r.data) ? r.data : [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-customer-stats'],
    queryFn: async () => {
      const r = await api.get('/admin/customers/stats');
      return r.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const r = await api.post('/admin/customers', data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customer-stats'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const r = await api.put(`/admin/customers/${id}`, data);
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      setEditingCustomer(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customer-stats'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/admin/customers/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
    },
  });

  const topUpMutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      await api.post(`/admin/customers/${id}/topup`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      setShowTopUp(false);
      setTopUpAmount('');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ id, newPassword }: { id: string; newPassword: string }) => {
      await api.post(`/admin/customers/${id}/reset-password`, { newPassword });
    },
    onSuccess: () => {
      setShowResetPassword(false);
      setNewPassword('');
    },
  });

  const filteredCustomers = customers || [];

  if (isLoading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Customers', value: stats.total, icon: User, color: 'text-blue-600 bg-blue-50' },
            { label: 'Individual', value: stats.individual, icon: User, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Enterprise', value: stats.enterprise, icon: Building2, color: 'text-violet-600 bg-violet-50' },
            { label: 'Active Accounts', value: stats.activeAccounts, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'Total Balance', value: `K${stats.totalBalance.toLocaleString()}`, icon: Wallet, color: 'text-amber-600 bg-amber-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                <s.icon size={18} />
              </div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <button
          onClick={() => { setEditingCustomer(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Account</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Vehicles</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer) => {
                const account = customer.accounts[0];
                return (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                        {customer.phone && <p className="text-xs text-gray-400">{customer.phone}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        customer.customerType === 'ENTERPRISE'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {customer.customerType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-500 font-mono">{account?.accountNumber || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-900">K{Number(account?.balance || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        account?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        account?.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {account?.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{account?.rfidTags?.length || 0}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedCustomer(customer); setShowTopUp(true); }}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Top Up"
                        >
                          <ArrowUpRight size={16} />
                        </button>
                        <button
                          onClick={() => { setSelectedCustomer(customer); setShowResetPassword(true); }}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = account?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                            statusMutation.mutate({ id: customer.id, status: newStatus });
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            account?.status === 'ACTIVE'
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={account?.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        >
                          <Ban size={16} />
                        </button>
                        <button
                          onClick={() => { setEditingCustomer(customer); setShowForm(true); }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => { if (confirm('Delete this customer?')) deleteMutation.mutate(customer.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">No customers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={() => { setShowForm(false); setEditingCustomer(null); }}
          onSubmit={(data) => {
            if (editingCustomer) {
              updateMutation.mutate({ id: editingCustomer.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
        />
      )}

      {/* Top Up Modal */}
      {showTopUp && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTopUp(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 mx-4">
            <button onClick={() => setShowTopUp(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Up Balance</h3>
            <p className="text-sm text-gray-500 mb-4">Customer: {selectedCustomer.name}</p>
            <input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Enter amount (MMK)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={() => topUpMutation.mutate({ id: selectedCustomer.id, amount: parseFloat(topUpAmount) })}
              disabled={!topUpAmount || topUpMutation.isPending}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {topUpMutation.isPending ? 'Processing...' : 'Top Up'}
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowResetPassword(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 mx-4">
            <button onClick={() => setShowResetPassword(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reset Password</h3>
            <p className="text-sm text-gray-500 mb-4">Customer: {selectedCustomer.name}</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 chars)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={() => resetPasswordMutation.mutate({ id: selectedCustomer.id, newPassword })}
              disabled={!newPassword || newPassword.length < 6 || resetPasswordMutation.isPending}
              className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50"
            >
              {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomerForm({ customer, onClose, onSubmit }: { customer: any | null; onClose: () => void; onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({
    email: customer?.email || '',
    password: '',
    name: customer?.name || '',
    customerType: customer?.customerType || 'INDIVIDUAL',
    phone: customer?.phone || '',
    nrcNumber: customer?.nrcNumber || '',
    drivingLicense: customer?.drivingLicense || '',
    companyName: customer?.companyName || '',
    companyRegNo: customer?.companyRegNo || '',
    companyAddress: customer?.companyAddress || '',
    fleetManagerName: customer?.fleetManagerName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = { ...form };
    if (!customer && !data.password) return;
    if (customer && !data.password) delete data.password;
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg p-6 mx-4 max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-4">{customer ? 'Edit Customer' : 'Add Customer'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          {!customer && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password *</label>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Customer Type</label>
              <select value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="INDIVIDUAL">Individual</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">NRC Number</label>
              <input value={form.nrcNumber} onChange={(e) => setForm({ ...form, nrcNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Driving License</label>
              <input value={form.drivingLicense} onChange={(e) => setForm({ ...form, drivingLicense: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          {form.customerType === 'ENTERPRISE' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Company Name</label>
                <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Company Reg No</label>
                  <input value={form.companyRegNo} onChange={(e) => setForm({ ...form, companyRegNo: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fleet Manager</label>
                  <input value={form.fleetManagerName} onChange={(e) => setForm({ ...form, fleetManagerName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Company Address</label>
                <input value={form.companyAddress} onChange={(e) => setForm({ ...form, companyAddress: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
              {customer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
