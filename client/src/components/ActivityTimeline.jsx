import React, { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, CheckSquare, MessageSquare, Plus, User, Clock } from 'lucide-react';
import api from '../services/api';

const activityIcons = {
  call: <Phone size={16} className="text-blue-500" />,
  email: <Mail size={16} className="text-green-500" />,
  meeting: <Calendar size={16} className="text-purple-500" />,
  task: <CheckSquare size={16} className="text-orange-500" />,
  note: <MessageSquare size={16} className="text-gray-500" />
};

export default function ActivityTimeline({ relatedModel, relatedId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'note',
    subject: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities', {
        params: { relatedModel, relatedId }
      });
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (relatedId) {
      fetchActivities();
    }
  }, [relatedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', {
        ...newActivity,
        relatedTo: {
          onModel: relatedModel,
          id: relatedId
        }
      });
      setShowForm(false);
      setNewActivity({
        type: 'note',
        subject: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchActivities();
    } catch (err) {
      console.error('Error creating activity:', err);
      alert('Failed to create activity');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Activity Timeline</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
        >
          <Plus size={16} />
          Log Activity
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="note">Note</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newActivity.date}
                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Summary of activity"
              required
              value={newActivity.subject}
              onChange={(e) => setNewActivity({ ...newActivity, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="2"
              placeholder="Details..."
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              Save Activity
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
        {loading ? (
            <p className="text-center text-gray-500 text-sm">Loading activities...</p>
        ) : activities.length === 0 ? (
            <p className="text-center text-gray-500 text-sm pl-8">No activities logged yet.</p>
        ) : (
            activities.map((activity) => (
            <div key={activity._id} className="relative pl-10">
                <div className="absolute left-0 top-1 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-10">
                    {activityIcons[activity.type]}
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-800 text-sm capitalize flex items-center gap-2">
                            {activity.subject}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                        {activity.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-xs text-gray-500 capitalize">
                            <span className={`px-2 py-0.5 rounded-full ${
                                activity.type === 'call' ? 'bg-blue-50 text-blue-600' :
                                activity.type === 'meeting' ? 'bg-purple-50 text-purple-600' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                                {activity.type}
                            </span>
                             • {new Date(activity.date).toLocaleDateString()}
                        </div>
                         <div className="flex items-center gap-1 text-xs text-gray-400">
                            <User size={12} />
                            {activity.createdBy?.name || 'Unknown'}
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}
