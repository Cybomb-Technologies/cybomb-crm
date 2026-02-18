import { LayoutDashboard, Users, Zap, CheckSquare, MessageSquare, BarChart, Settings, Briefcase, UserCheck, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Leads', icon: Users, path: '/leads' },
  { name: 'Deals', icon: Briefcase, path: '/deals' },
  { name: 'Customers', icon: UserCheck, path: '/customers' },
  { name: 'Activities', icon: CheckSquare, path: '/activities' },
  { name: 'Support', icon: MessageSquare, path: '/support' },
  { name: 'Reports', icon: BarChart, path: '/reports' },
  { name: 'Automation', icon: Zap, path: '/automation' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-500">Cybomb CRM</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-xs font-bold">{initials}</span>
            </div>
            <div className="text-sm min-w-0">
              <p className="text-white font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role?.replace('_', ' ') || 'Member'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-400 transition-colors p-1"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
