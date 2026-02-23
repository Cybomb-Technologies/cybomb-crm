import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiCheck, FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

function NotificationsDemo() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Pass filter=all to see both read and unread for the demo
      const res = await axios.get('http://localhost:5000/api/notifications?filter=all', config);
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id = 'all') => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, config);
      
      // Update local state instantly
      if (id === 'all') {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      } else {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const createTestNotification = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Direct database insert for testing purposes from a generic endpoint, 
      // but we don't have a generic "create note" endpoint. 
      // We will simulate it by telling the user to create an Automation Rule.
      alert('To test this properly, go to Automations and create a rule that fires "Send Notification" when a Lead is created. Then, go create a Lead!');
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-green-500" />;
      case 'warning': return <FiAlertTriangle className="text-yellow-500" />;
      case 'error': return <FiXCircle className="text-red-500" />;
      default: return <FiInfo className="text-blue-500" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FiBell /> Inbox Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Testing grounds for the notification engine before Navbar integration.
          </p>
        </div>

        <div className="flex gap-3">
            <button 
                onClick={createTestNotification}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
                How to Test
            </button>
            <button 
                onClick={() => markAsRead('all')}
                disabled={unreadCount === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
                Mark all as read
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Your Notifications</span>
            {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount} Unread
                </span>
            )}
        </div>

        {loading ? (
           <div className="p-10 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
           <div className="p-20 text-center text-gray-500">
               <FiBell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
               <p>You're all caught up!</p>
           </div>
        ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {notifications.map(notif => (
                    <div 
                        key={notif._id} 
                        className={`p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                        <div className="mt-1">
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                {notif.title}
                            </h4>
                            {notif.message && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                            )}
                            <span className="text-xs text-gray-500 mt-2 block">
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        {!notif.isRead && (
                            <button 
                                onClick={() => markAsRead(notif._id)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                title="Mark as read"
                            >
                                <FiCheck />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
}

export default NotificationsDemo;
