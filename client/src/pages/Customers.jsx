import Layout from '../components/Layout';
import { Plus, Search, Filter, MoreHorizontal, MapPin, Building2, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const dummyCustomers = [
  { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '+1 555-0101', company: 'Acme Corp', address: { city: 'New York', country: 'USA' }, createdAt: '2024-01-15' },
  { id: 2, name: 'Sarah Mitchell', email: 'sarah@techstart.io', phone: '+1 555-0202', company: 'TechStart Inc', address: { city: 'San Francisco', country: 'USA' }, createdAt: '2024-02-20' },
  { id: 3, name: 'Raj Patel', email: 'raj@globaltraders.in', phone: '+91 98765-43210', company: 'Global Traders', address: { city: 'Mumbai', country: 'India' }, createdAt: '2024-03-05' },
  { id: 4, name: 'Emma Wilson', email: 'emma@nordicsolutions.se', phone: '+46 70 123 4567', company: 'Nordic Solutions', address: { city: 'Stockholm', country: 'Sweden' }, createdAt: '2024-03-18' },
  { id: 5, name: 'Carlos Mendez', email: 'carlos@latamlogistics.mx', phone: '+52 55 1234 5678', company: 'LATAM Logistics', address: { city: 'Mexico City', country: 'Mexico' }, createdAt: '2024-04-02' },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = dummyCustomers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} total customers</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={20} />
          New Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filter
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Added</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{customer.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail size={11} />
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <Building2 size={14} className="text-gray-400" />
                    {customer.company}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    {customer.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    {customer.address.city}, {customer.address.country}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No customers found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
