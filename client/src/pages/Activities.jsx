import Layout from '../components/Layout';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import ActivityFilters from '../components/activities/ActivityFilters';
import ActivityCard from '../components/activities/ActivityCard';

const dummyActivities = [
  { id: 1, type: 'call', subject: 'Intro call with Acme Corp', description: 'Discuss product requirements and pricing', date: '2024-04-10T10:00:00', status: 'completed', assignedTo: 'Jane Doe', relatedTo: 'Acme Corp' },
  { id: 2, type: 'meeting', subject: 'Demo presentation for TechStart', description: 'Show platform features and integrations', date: '2024-04-12T14:30:00', status: 'pending', assignedTo: 'Mike Ross', relatedTo: 'TechStart Inc' },
  { id: 3, type: 'email', subject: 'Follow up on proposal', description: 'Send revised pricing document', date: '2024-04-11T09:00:00', status: 'completed', assignedTo: 'Jane Doe', relatedTo: 'Global Traders' },
  { id: 4, type: 'task', subject: 'Prepare contract draft', description: 'Draft MSA for enterprise deal', date: '2024-04-15T17:00:00', status: 'pending', assignedTo: 'John Smith', relatedTo: 'BigCo' },
  { id: 5, type: 'note', subject: 'Meeting notes — Nordic Solutions', description: 'Key takeaways from discovery session', date: '2024-04-09T16:00:00', status: 'completed', assignedTo: 'Sarah Lee', relatedTo: 'Nordic Solutions' },
  { id: 6, type: 'call', subject: 'Support check-in with LATAM Logistics', description: 'Quarterly review call', date: '2024-04-18T11:00:00', status: 'pending', assignedTo: 'Mike Ross', relatedTo: 'LATAM Logistics' },
];

export default function Activities() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = dummyActivities.filter(a => {
    const matchesTab = activeTab === 'all' || a.type === activeTab;
    const matchesSearch = a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Activities</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} activities</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
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
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          />
        </div>
      </div>

      {/* Activity Cards */}
      <div className="space-y-3">
        {filtered.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No activities found.
          </div>
        )}
      </div>
    </Layout>
  );
}
