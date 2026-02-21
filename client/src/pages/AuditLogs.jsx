import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiActivity, FiUser, FiBox, FiClock, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

function AuditLogs() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [token, page, actionFilter, entityFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let query = `?page=${page}&limit=20`;
      if (actionFilter) query += `&action=${actionFilter}`;
      if (entityFilter) query += `&entityType=${entityFilter}`;

      const res = await axios.get(`http://localhost:5000/api/audit-logs${query}`, config);
      
      setLogs(res.data.logs);
      setTotalPages(res.data.pages);
      setTotalLogs(res.data.total);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = (action) => {
    switch(action) {
      case 'CREATE': return { icon: <FiPlus />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30 ring-green-500/20' };
      case 'UPDATE': return { icon: <FiEdit2 />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30 ring-blue-500/20' };
      case 'DELETE': return { icon: <FiTrash2 />, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30 ring-red-500/20' };
      default: return { icon: <FiActivity />, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800 ring-gray-500/20' };
    }
  };

  const formatChanges = (changes, action) => {
    if (!changes || Object.keys(changes).length === 0) return null;
    
    // For CREATE/DELETE, just show the name or title if available
    if (action === 'CREATE' || action === 'DELETE') {
      const identifier = changes.name || changes.title || changes.subject || 'a record';
      return <span className="font-medium text-gray-900 dark:text-white">{identifier}</span>;
    }

    // For UPDATE, show modified fields
    const fields = Object.keys(changes);
    // Ignore internal fields
    const displayFields = fields.filter(f => !['_id', '__v', 'updatedAt', 'organization'].includes(f));
    
    if (displayFields.length === 0) return <span>Updated details</span>;
    
    return (
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Updated fields: <span className="font-medium text-gray-800 dark:text-gray-200">{displayFields.join(', ')}</span>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review activity and data changes across your organization.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select 
            value={entityFilter} 
            onChange={(e) => {setEntityFilter(e.target.value); setPage(1);}}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Entities</option>
            <option value="Lead">Leads</option>
            <option value="Deal">Deals</option>
            <option value="Customer">Customers</option>
            <option value="Ticket">Tickets</option>
          </select>

          <select 
            value={actionFilter} 
            onChange={(e) => {setActionFilter(e.target.value); setPage(1);}}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Actions</option>
            <option value="CREATE">Creates</option>
            <option value="UPDATE">Updates</option>
            <option value="DELETE">Deletes</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>Showing {logs.length} of {totalLogs} events</span>
        </div>

        {loading && page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 font-medium">{error}</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <FiActivity className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-lg font-medium">No activity found</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="px-6 py-6">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {logs.map((log, logIdx) => {
                  const actionConfig = getActionConfig(log.action);
                  const isLastItem = logIdx === logs.length - 1;

                  return (
                    <li key={log._id}>
                      <div className="relative pb-8">
                        {!isLastItem ? (
                          <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex items-start space-x-4">
                          <div className="relative">
                            <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-4 ${actionConfig.bg} ${actionConfig.color}`}>
                              {actionConfig.icon}
                            </span>
                          </div>
                          
                          <div className="min-w-0 flex-1 py-1.5">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium text-gray-900 dark:text-white mr-2">
                                {log.user ? log.user.name : 'Unknown User'}
                              </span>
                              <span className="capitalize">{log.action.toLowerCase()}d</span> a 
                              <span className="font-medium text-gray-800 dark:text-gray-200 mx-1">{log.entityType}</span>
                              <span className="whitespace-nowrap ml-2 text-xs text-gray-400 dark:text-gray-500">
                                {format(new Date(log.createdAt), 'MMM d, yyyy • h:mm a')}
                              </span>
                            </div>
                            
                            <div className="mt-1">
                                {formatChanges(log.changes, log.action)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                page === 1 
                  ? 'text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                page === totalPages 
                  ? 'text-gray-400 bg-gray-100 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;
