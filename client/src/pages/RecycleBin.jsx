import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiRotateCcw, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

function RecycleBin() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/recycle-bin', config);
      setItems(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recycle bin');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id, entityType) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/recycle-bin/restore', { id, entityType }, config);
      // Remove from list
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restore item');
    }
  };

  const handleHardDelete = async (id, entityType) => {
    if (!window.confirm('Are you sure? This action cannot be undone and the record will be permanently deleted.')) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete('http://localhost:5000/api/recycle-bin/delete', {
        headers: config.headers,
        data: { id, entityType }
      });
      // Remove from list
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item permanently');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl dark:bg-red-900/30 dark:text-red-400">
          <FiTrash2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recycle Bin</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
            <FiAlertCircle /> Deleted records stay here until permanently removed.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 font-medium">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">Recycle bin is empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Record Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Entity Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Deleted At
                  </th>
                  <th scope="col" className="relative px-6 py-4 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {item.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(item.deletedAt), 'MMM d, yyyy • h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleRestore(item._id, item.entityType)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                          title="Restore Record"
                        >
                          <FiRotateCcw className="w-4 h-4" /> Restore
                        </button>
                        <button
                          onClick={() => handleHardDelete(item._id, item.entityType)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 transition-colors"
                          title="Permanently Delete"
                        >
                          <FiAlertTriangle className="w-4 h-4" /> Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecycleBin;
