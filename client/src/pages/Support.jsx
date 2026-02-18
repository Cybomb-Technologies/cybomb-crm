import Layout from '../components/Layout';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import SupportStats from '../components/support/SupportStats';
import SupportTicketRow from '../components/support/SupportTicketRow';

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
      <SupportStats
        statusCounts={statusCounts}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

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
              <SupportTicketRow key={ticket.id} ticket={ticket} />
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
