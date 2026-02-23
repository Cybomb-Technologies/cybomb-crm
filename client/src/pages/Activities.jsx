import Layout from '../components/Layout';
import { Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import ActivityFilters from '../components/activities/ActivityFilters';
import ActivityCard from '../components/activities/ActivityCard';
import ActivityModal from '../components/ActivityModal';
import api from '../services/api';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleNewActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const filtered = activities.filter(a => {
    const matchesTab = activeTab === 'all' || a.type === activeTab;
    const matchesSearch = 
      a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.assignedTo?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      // a.relatedTo logic would require related doc population, currently simple string in previous dummy
      // With real data, relatedTo is object { onModel, id }. We might not have name populated depending on controller
    return matchesTab && matchesSearch;
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Activities</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} activities</p>
        </div>
        <button 
          onClick={handleNewActivity}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={20} />
          New Activity
        </button>
      </div>

      {/* Tabs */}
      <ActivityFilters activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search activities by subject or assignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>
      </div>

      {/* Activity Cards */}
      <div className="space-y-3">
        {loading ? (
             <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
             </div>
        ) : (
            <>
                {filtered.map((activity) => (
                <div key={activity._id} onClick={() => handleEdit(activity)}>
                     <ActivityCard activity={activity} />
                </div>
                ))}

                {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No activities found.
                </div>
                )}
            </>
        )}
      </div>

      <ActivityModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        activityToEdit={selectedActivity}
        onActivityUpdated={fetchActivities}
      />
    </Layout>
  );
}
