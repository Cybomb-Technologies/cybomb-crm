import Layout from '../components/Layout';
import { Plus, Search, Filter, MoreHorizontal, Clock, AlertTriangle, AlertCircle, CheckCircle2, Pause, XCircle } from 'lucide-react';
import { useState } from 'react';

const statusConfig = {
  open: { color: 'bg-blue-100 text-blue-700', label: 'Open' },
  in_progress: { color: 'bg-yellow-100 text-yellow-700', label: 'In Progress' },
  waiting: { color: 'bg-orange-100 text-orange-700', label: 'Waiting' },
  resolved: { color: 'bg-green-100 text-green-700', label: 'Resolved' },
  closed: { color: 'bg-gray-100 text-gray-600', label: 'Closed' },
};

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-600', label: 'Low' },
  medium: { color: 'bg-blue-100 text-blue-600', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-700', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-700', label: 'Urgent' },
};

const dummyTickets = [
  { id: 1, subject: 'Cannot access dashboard', customer: 'Acme Corp', status: 'open', priority: 'high', assignedTo: 'Mike Ross', category: 'Bug', createdAt: '2024-04-10' },
  { id: 2, subject: 'Reset password request', customer: 'TechStart Inc', status: 'in_progress', priority: 'medium', assignedTo: 'Jane Doe', category: 'Account', createdAt: '2024-04-11' },
  { id: 3, subject: 'Feature request: Export data', customer: 'Global Traders', status: 'waiting', priority: 'low', assignedTo: 'Sarah Lee', category: 'Feature', createdAt: '2024-04-09' },
  { id: 4, subject: 'Billing discrepancy on invoice', customer: 'BigCo', status: 'resolved', priority: 'urgent', assignedTo: 'John Smith', category: 'Billing', createdAt: '2024-04-08' },
  { id: 5, subject: 'API rate limit exceeded', customer: 'Nordic Solutions', status: 'open', priority: 'high', assignedTo: 'Mike Ross', category: 'Technical', createdAt: '2024-04-12' },
  { id: 6, subject: 'Onboarding assistance needed', customer: 'LATAM Logistics', status: 'closed', priority: 'low', assignedTo: 'Jane Doe', category: 'Onboarding', createdAt: '2024-04-07' },
];

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = dummyTickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: dummyTickets.length,
    open: dummyTickets.filter(t => t.status === 'open').length,
    in_progress: dummyTickets.filter(t => t.status === 'in_progress').length,
    waiting: dummyTickets.filter(t => t.status === 'waiting').length,
    resolved: dummyTickets.filter(t => t.status === 'resolved').length,
    closed: dummyTickets.filter(t => t.status === 'closed').length,
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} tickets</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={20} />
          New Ticket
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {Object.entries(statusCounts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`p-3 rounded-lg border text-center transition-all ${
              statusFilter === key
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <div className="text-xl font-bold text-gray-800">{count}</div>
            <div className="text-xs text-gray-500 capitalize mt-0.5">
              {key === 'all' ? 'All' : statusConfig[key]?.label || key}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Ticket</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 text-sm">{ticket.subject}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{ticket.category}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{ticket.customer}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[ticket.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {statusConfig[ticket.status]?.label || ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[ticket.priority]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {priorityConfig[ticket.priority]?.label || ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
