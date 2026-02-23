import React, { useState, useEffect } from 'react';
import { X, Building2, User, Phone, Mail, MapPin } from 'lucide-react';
import api from '../services/api';

export default function CustomerModal({ isOpen, onClose, customerToEdit, onCustomerUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        setFormData({
            ...customerToEdit,
            address: {
                street: customerToEdit.address?.street || '',
                city: customerToEdit.address?.city || '',
                state: customerToEdit.address?.state || '',
                zip: customerToEdit.address?.zip || '',
                country: customerToEdit.address?.country || ''
            }
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          }
        });
      }
    }
  }, [isOpen, customerToEdit]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
        const addressField = name.split('.')[1];
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [addressField]: value }
        }));
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (customerToEdit) {
        await api.put(`/customers/${customerToEdit._id}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      onCustomerUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {customerToEdit ? 'Edit Customer' : 'New Customer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                 <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    />
                 </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                 <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Acme Corp"
                    />
                 </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                 <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                    />
                 </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                 <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="+1 555-0123"
                    />
                 </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-50">
             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin size={16} /> Address
             </h3>
             <div className="space-y-3">
                 <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Street Address"
                />
                <div className="grid grid-cols-2 gap-4">
                     <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="City"
                    />
                     <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="State"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <input
                        type="text"
                        name="address.zip"
                        value={formData.address.zip}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="ZIP Code"
                    />
                     <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Country"
                    />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-all font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
