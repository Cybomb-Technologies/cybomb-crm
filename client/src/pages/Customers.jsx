import Layout from '../components/Layout';
import { Plus, Search, Filter, MoreHorizontal, MapPin, Building2, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CustomerModal from '../components/CustomerModal';
import { useAuth } from '../context/AuthContext';

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
        try {
            await api.delete(`/customers/${id}`);
            fetchCustomers();
        } catch (err) {
            console.error('Error deleting customer:', err);
            alert('Failed to delete customer');
        }
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} total customers</p>
        </div>
        <button 
          onClick={handleNewCustomer}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
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

        {loading ? (
             <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
             </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <tr>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Company</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Added</th>
                    <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                            <Link to={`/customers/${customer._id}`} className="font-medium text-gray-900 text-sm hover:text-blue-600 hover:underline">
                                {customer.name}
                            </Link>
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
                            {customer.company || 'N/A'}
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                            <Phone size={14} className="text-gray-400" />
                            {customer.phone || 'N/A'}
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                            <MapPin size={14} className="text-gray-400" />
                            {customer.address?.city ? `${customer.address.city}, ${customer.address.country}` : 'N/A'}
                        </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleEdit(customer)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                {['org_admin', 'sales_manager'].includes(user?.role) && (
                                  <button 
                                      onClick={() => handleDelete(customer._id)}
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                      <Trash2 size={18} />
                                  </button>
                                )}
                           </div>
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
        )}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        customerToEdit={selectedCustomer}
        onCustomerUpdated={fetchCustomers}
      />
    </Layout>
  );
}
