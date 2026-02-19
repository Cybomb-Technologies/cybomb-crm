import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import api from '../services/api';
import LeadModal from '../components/LeadModal';
import Pagination from '../components/Pagination';
import KanbanBoard from '../components/KanbanBoard';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Download, Upload, LayoutGrid, List } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    page: 1,
    limit: 10,
    sort: 'createdAt:desc'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: filters.page,
        limit: filters.limit,
        sort: filters.sort,
        // Only add if not empty to keep URL clean
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.source && { source: filters.source }),
      });
      
      const res = await api.get(`/leads?${params}`);
      setLeads(res.data.leads);
      setPagination({
        total: res.data.total,
        page: res.data.page,
        pages: res.data.pages
      });
      // Clear selection on new fetch
      setSelectedLeads([]);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSort = (field) => {
    setFilters(prev => {
      const [currentField, currentOrder] = prev.sort.split(':');
      let newOrder = 'asc';
      if (currentField === field && currentOrder === 'asc') {
        newOrder = 'desc';
      }
      return { ...prev, sort: `${field}:${newOrder}`, page: 1 };
    });
  };

  const handleExport = async () => {
    try {
        const res = await api.get('/leads/export', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'leads.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (err) {
        console.error('Error exporting leads:', err);
        alert('Failed to export leads');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        setLoading(true);
        await api.post('/leads/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Leads imported successfully');
        fetchLeads();
    } catch (err) {
        console.error('Error importing leads:', err);
        alert('Failed to import leads');
    } finally {
        setLoading(false);
        // Reset file input
        e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (err) {
        console.error('Error deleting lead:', err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
        try {
            await api.post('/leads/bulk-delete', { ids: selectedLeads });
            fetchLeads();
        } catch (err) {
            console.error('Error deleting leads:', err);
            alert('Failed to delete leads');
        }
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
        setSelectedLeads(leads.map(lead => lead._id));
    } else {
        setSelectedLeads([]);
    }
  };

  const toggleSelectLead = (id) => {
    setSelectedLeads(prev => 
        prev.includes(id) 
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const openModal = (lead = null) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const renderSortIcon = (field) => {
    const [currentField, currentOrder] = filters.sort.split(':');
    if (currentField !== field) return null;
    return currentOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
        <div className="flex gap-2">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center mr-2">
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    title="List View"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Kanban View"
                >
                    <LayoutGrid size={18} />
                </button>
            </div>

            <button 
              onClick={handleExport}
              className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Download size={18} />
              Export
            </button>
            <label className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
              <Upload size={18} />
              Import
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>
            {selectedLeads.length > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-red-200"
                >
                  <Trash2 size={18} />
                  Delete ({selectedLeads.length})
                </button>
            )}
            <button 
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              New Lead
            </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <KanbanBoard leads={leads} onLeadUpdate={fetchLeads} />
      ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={filters.search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
             <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
             <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="cold_call">Cold Call</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 w-10">
                    <input 
                        type="checkbox" 
                        onChange={toggleSelectAll}
                        checked={leads.length > 0 && selectedLeads.length === leads.length}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </th>
                <th 
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('name')}
                >
                    Name {renderSortIcon('name')}
                </th>
                <th 
                    className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    onClick={() => handleSort('company')}
                >
                    Company {renderSortIcon('company')}
                </th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                 <tr>
                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No leads found.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className={`hover:bg-gray-50 transition-colors ${selectedLeads.includes(lead._id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                        <input 
                            type="checkbox" 
                            checked={selectedLeads.includes(lead._id)}
                            onChange={() => toggleSelectLead(lead._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/leads/${lead._id}`} className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
                        {lead.name}
                      </Link>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lead.tags?.map((tag, i) => (
                           <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lead.company}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        lead.status === 'qualified' ? 'bg-purple-100 text-purple-700' :
                        lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{lead.source?.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {lead.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(lead)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                         <button 
                          onClick={() => handleDelete(lead._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                           title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))

              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && (
            <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
        )}
      </div>
      )}

      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        leadToEdit={leadToEdit}
        onSave={fetchLeads}
      />
    </Layout>
  );
}
