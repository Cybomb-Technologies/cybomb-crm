import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

export default function DealModal({ isOpen, onClose, dealToEdit, onDealUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'Discovery',
    expectedCloseDate: '',
    contactPerson: '',
    assignedTo: '',
    notes: ''
  });
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]); // Ideally separate endpoint for contacts/leads
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchContacts();
      if (dealToEdit) {
        setFormData({
            ...dealToEdit,
            contactPerson: dealToEdit.contactPerson?._id || '',
            assignedTo: dealToEdit.assignedTo?._id || '',
            expectedCloseDate: dealToEdit.expectedCloseDate ? new Date(dealToEdit.expectedCloseDate).toISOString().split('T')[0] : ''
        });
      } else {
        setFormData({
          title: '',
          value: '',
          stage: 'Discovery',
          expectedCloseDate: '',
          contactPerson: '',
          assignedTo: '',
          notes: ''
        });
      }
    }
  }, [isOpen, dealToEdit]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchContacts = async () => {
     try {
        // Reuse leads as contacts for now
        const res = await api.get('/leads?limit=100'); 
        setContacts(res.data.leads || []);
     } catch (err) {
        console.error('Error fetching contacts:', err);
     }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (dealToEdit) {
        await api.put(`/deals/${dealToEdit._id}`, formData);
      } else {
        await api.post('/deals', formData);
      }
      onDealUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving deal:', err);
      alert('Failed to save deal');
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
            {dealToEdit ? 'Edit Deal' : 'New Deal'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deal Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Acme Corp Software License"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                <input
                type="date"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Discovery">Discovery</option>
              <option value="Demo">Demo</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person (Lead)</label>
                <select
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                <option value="">Select Lead</option>
                {contacts.map(contact => (
                    <option key={contact._id} value={contact._id}>
                    {contact.name} ({contact.company})
                    </option>
                ))}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                <option value="">Select Owner</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>
                    {user.name}
                    </option>
                ))}
                </select>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            ></textarea>
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
              {loading ? 'Saving...' : 'Save Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
