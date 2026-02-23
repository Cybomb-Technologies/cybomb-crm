import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, CheckCircle, User, Link as LinkIcon } from 'lucide-react';
import api from '../services/api';

export default function ActivityModal({ isOpen, onClose, activityToEdit, onActivityUpdated }) {
  const [formData, setFormData] = useState({
    type: 'call',
    subject: '',
    description: '',
    date: '',
    time: '',
    status: 'pending',
    assignedTo: '',
    relatedToModel: 'Lead', // Default
    relatedToId: ''
  });
  const [users, setUsers] = useState([]);
  const [relatedItems, setRelatedItems] = useState([]); // Leads, Deals, Customers
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (activityToEdit) {
        const dateObj = new Date(activityToEdit.date);
        setFormData({
            type: activityToEdit.type,
            subject: activityToEdit.subject,
            description: activityToEdit.description || '',
            date: dateObj.toISOString().split('T')[0],
            time: dateObj.toTimeString().slice(0, 5),
            status: activityToEdit.status,
            assignedTo: activityToEdit.assignedTo?._id || activityToEdit.assignedTo || '',
            relatedToModel: activityToEdit.relatedTo?.onModel || 'Lead',
            relatedToId: activityToEdit.relatedTo?.id || ''
        });
        fetchRelatedItems(activityToEdit.relatedTo?.onModel || 'Lead');
      } else {
        const now = new Date();
        setFormData({
            type: 'call',
            subject: '',
            description: '',
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5),
            status: 'pending',
            assignedTo: '',
            relatedToModel: 'Lead',
            relatedToId: ''
        });
        fetchRelatedItems('Lead');
      }
    }
  }, [isOpen, activityToEdit]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchRelatedItems = async (model) => {
      try {
          let endpoint = '';
          switch(model) {
              case 'Lead': endpoint = '/leads?limit=100'; break;
              case 'Deal': endpoint = '/deals'; break;
              case 'Customer': endpoint = '/customers'; break;
              default: return;
          }
          const res = await api.get(endpoint);
          // Normalize data for dropdown
          const items = (res.data.leads || res.data).map(item => ({
              id: item._id,
              label: item.name || item.title // Leads/Customers use name, Deals use title
          }));
          setRelatedItems(items);
      } catch (err) {
          console.error(`Error fetching ${model}s:`, err);
          setRelatedItems([]);
      }
  };

  const handleModelChange = (e) => {
      const model = e.target.value;
      setFormData(prev => ({ ...prev, relatedToModel: model, relatedToId: '' }));
      fetchRelatedItems(model);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dateTime = new Date(`${formData.date}T${formData.time}`);

    const payload = {
        type: formData.type,
        subject: formData.subject,
        description: formData.description,
        date: dateTime,
        status: formData.status,
        assignedTo: formData.assignedTo,
        relatedTo: formData.relatedToId ? {
            onModel: formData.relatedToModel,
            id: formData.relatedToId
        } : undefined
    };

    try {
      if (activityToEdit) {
        await api.put(`/activities/${activityToEdit._id}`, payload);
      } else {
        await api.post('/activities', payload);
      }
      onActivityUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving activity:', err);
      alert('Failed to save activity');
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
            {activityToEdit ? 'Edit Activity' : 'Log Activity'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="relative">
                     <FileText className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                    >
                        <option value="call">Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                        <option value="note">Note</option>
                        <option value="task">Task</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                    <CheckCircle className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Intro meeting"
            />
          </div>
          
           {/* Date & Time */}
           <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="relative">
                    <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>
          </div>
          
           {/* Related To */}
           <div className="grid grid-cols-3 gap-4">
             <div className="col-span-1">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Related To</label>
                 <select
                    name="relatedToModel"
                    value={formData.relatedToModel}
                    onChange={handleModelChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                 >
                     <option value="Lead">Lead</option>
                     <option value="Deal">Deal</option>
                     <option value="Customer">Customer</option>
                 </select>
             </div>
             <div className="col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Record</label>
                 <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <select
                        name="relatedToId"
                        value={formData.relatedToId}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                    >
                         <option value="">Select Record...</option>
                         {relatedItems.map(item => (
                             <option key={item.id} value={item.id}>{item.label}</option>
                         ))}
                    </select>
                 </div>
             </div>
           </div>


          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                >
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>
                    {user.name}
                    </option>
                ))}
                </select>
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Meeting notes or details..."
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
              {loading ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
