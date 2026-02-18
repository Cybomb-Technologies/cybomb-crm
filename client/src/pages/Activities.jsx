import Layout from '../components/Layout';
import { Plus, Search, Phone, Video, Mail, FileText, StickyNote, Clock, CheckCircle2, XCircle, Filter } from 'lucide-react';
import { useState } from 'react';

const typeConfig = {
  call: { icon: Phone, color: 'bg-green-100 text-green-600', label: 'Call' },
  meeting: { icon: Video, color: 'bg-purple-100 text-purple-600', label: 'Meeting' },
  email: { icon: Mail, color: 'bg-blue-100 text-blue-600', label: 'Email' },
  task: { icon: FileText, color: 'bg-orange-100 text-orange-600', label: 'Task' },
  note: { icon: StickyNote, color: 'bg-yellow-100 text-yellow-600', label: 'Note' },
};

const statusConfig = {
  pending: { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Pending' },
  completed: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelled' },
};

const dummyActivities = [
  { id: 1, type: 'call', subject: 'Intro call with Acme Corp', description: 'Discuss product requirements and pricing', date: '2024-04-10T10:00:00', status: 'completed', assignedTo: 'Jane Doe', relatedTo: 'Acme Corp' },
  { id: 2, type: 'meeting', subject: 'Demo presentation for TechStart', description: 'Show platform features and integrations', date: '2024-04-12T14:30:00', status: 'pending', assignedTo: 'Mike Ross', relatedTo: 'TechStart Inc' },
  { id: 3, type: 'email', subject: 'Follow up on proposal', description: 'Send revised pricing document', date: '2024-04-11T09:00:00', status: 'completed', assignedTo: 'Jane Doe', relatedTo: 'Global Traders' },
  { id: 4, type: 'task', subject: 'Prepare contract draft', description: 'Draft MSA for enterprise deal', date: '2024-04-15T17:00:00', status: 'pending', assignedTo: 'John Smith', relatedTo: 'BigCo' },
  { id: 5, type: 'note', subject: 'Meeting notes — Nordic Solutions', description: 'Key takeaways from discovery session', date: '2024-04-09T16:00:00', status: 'completed', assignedTo: 'Sarah Lee', relatedTo: 'Nordic Solutions' },
  { id: 6, type: 'call', subject: 'Support check-in with LATAM Logistics', description: 'Quarterly review call', date: '2024-04-18T11:00:00', status: 'pending', assignedTo: 'Mike Ross', relatedTo: 'LATAM Logistics' },
];

const tabs = ['all', 'call', 'meeting', 'email', 'task', 'note'];

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
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'all' ? 'All' : typeConfig[tab]?.label || tab}
          </button>
        ))}
      </div>

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
        {filtered.map((activity) => {
          const TypeIcon = typeConfig[activity.type]?.icon || FileText;
          const typeColor = typeConfig[activity.type]?.color || 'bg-gray-100 text-gray-600';
          const StatusIcon = statusConfig[activity.status]?.icon || Clock;
          const statusColor = statusConfig[activity.status]?.color || 'bg-gray-100 text-gray-600';
          const statusLabel = statusConfig[activity.status]?.label || activity.status;

          return (
            <div key={activity.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColor}`}>
                  <TypeIcon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{activity.subject}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0 ${statusColor}`}>
                      <StatusIcon size={12} />
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {' '}
                      {new Date(activity.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span>{activity.relatedTo}</span>
                    <span>•</span>
                    <span>{activity.assignedTo}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No activities found.
          </div>
        )}
      </div>
    </Layout>
  );
}
