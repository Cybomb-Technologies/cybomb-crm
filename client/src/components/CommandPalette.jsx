import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiX, FiBriefcase, FiUsers, FiUser, FiLifeBuoy } from 'react-icons/fi';

const CommandPalette = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ leads: [], deals: [], customers: [], tickets: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  
  // Track selected index for keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatResultsRef = useRef([]);

  // Toggle palette with Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      // Close palette on Esc
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults({ leads: [], deals: [], customers: [], tickets: [] });
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced Search API Call
  useEffect(() => {
    if (!query || query.length < 2 || !token) {
      setResults({ leads: [], deals: [], customers: [], tickets: [] });
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`http://localhost:5000/api/search?q=${query}`, config);
        setResults(res.data);
        setSelectedIndex(0); // Reset selection
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, token]);

  // Flatten results for keyboard navigation
  useEffect(() => {
    const flat = [
      ...results.leads.map(r => ({ ...r, type: 'lead', path: `/leads/${r._id}` })),
      ...results.deals.map(r => ({ ...r, type: 'deal', path: `/deals` })), // Deals might not have a detail page yet, just routing
      ...results.customers.map(r => ({ ...r, type: 'customer', path: `/customers/${r._id}` })),
      ...results.tickets.map(r => ({ ...r, type: 'ticket', path: `/support` })) // Tickets might just go to support
    ];
    flatResultsRef.current = flat;
  }, [results]);

  // Handle Keyboard Navigation within results
  const handleInputKeyDown = (e) => {
    const totalItems = flatResultsRef.current.length;
    if (totalItems === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = flatResultsRef.current[selectedIndex];
      if (selectedItem) {
        handleNavigate(selectedItem.path);
      }
    }
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  if (!isOpen || !isAuthenticated) return null;

  // Helper to render sections
  const renderSection = (title, items, icon, colorClass, type) => {
    if (items.length === 0) return null;
    
    // Find the starting index for this type in the flattened array
    const startIndex = flatResultsRef.current.findIndex(item => item.type === type);

    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">{title}</h3>
        <ul>
          {items.map((item, index) => {
            const globalIndex = startIndex + index;
            const isSelected = selectedIndex === globalIndex;
            
            return (
              <li key={item._id}>
                <button
                  onClick={() => handleNavigate(flatResultsRef.current[globalIndex].path)}
                  onMouseEnter={() => setSelectedIndex(globalIndex)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-md ${colorClass} bg-opacity-10`}>
                    {icon}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name || item.title}
                    </p>
                    {(item.email || item.company || item.stage || item.status) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.email || item.stage || item.status} {item.company ? `• ${item.company}` : ''}
                      </p>
                    )}
                  </div>
                  {isSelected && <span className="text-xs text-gray-400">Enter</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 shadow-2xl">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Palette */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all">
        {/* Search Input Area */}
        <div className="relative border-b border-gray-100 dark:border-gray-700">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-0 pl-12 pr-12 py-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 text-lg outline-none"
            placeholder="Search leads, deals, customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          {loading && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md p-1"
          >
            <span className="text-xs font-mono">ESC</span>
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-2 pb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600">
          {!query ? (
            <div className="text-center py-10 px-4 text-gray-500 dark:text-gray-400">
              <p className="mb-2">Search across your entire CRM</p>
              <div className="flex justify-center gap-2 text-xs font-mono">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">ctrl</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">K</span>
              </div>
            </div>
          ) : flatResultsRef.current.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <>
              {renderSection('Leads', results.leads, <FiUser className="text-blue-600 dark:text-blue-400" />, 'bg-blue-100 dark:bg-blue-900', 'lead')}
              {renderSection('Deals', results.deals, <FiBriefcase className="text-purple-600 dark:text-purple-400" />, 'bg-purple-100 dark:bg-purple-900', 'deal')}
              {renderSection('Customers', results.customers, <FiUsers className="text-green-600 dark:text-green-400" />, 'bg-green-100 dark:bg-green-900', 'customer')}
              {renderSection('Tickets', results.tickets, <FiLifeBuoy className="text-orange-600 dark:text-orange-400" />, 'bg-orange-100 dark:bg-orange-900', 'ticket')}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 hidden sm:flex">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-gray-700 rounded px-1 min-w-[1.2rem] text-center">↑</kbd><kbd className="bg-gray-200 dark:bg-gray-700 rounded px-1 min-w-[1.2rem] text-center">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-gray-700 rounded px-1">↵</kbd> to select</span>
            <span className="flex items-center gap-1"><kbd className="bg-gray-200 dark:bg-gray-700 rounded px-1">esc</kbd> to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
