import {
  Home,
  BarChart,
  Target,
  Users,
  Building2,
  Briefcase,
  CheckSquare,
  Calendar,
  Phone,
  Megaphone,
  FileText,
  MapPin,
  FolderKanban,
  Search,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const mainItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Reports', icon: BarChart, path: '/reports' },
];

const moduleItems = [
  { name: 'Leads', icon: Target, path: '/leads' },
  { name: 'Customers', icon: Users, path: '/customers' },
  { name: 'Deals', icon: Briefcase, path: '/deals' },
  { name: 'Activities', icon: CheckSquare, path: '/activities' },
  { name: 'Support', icon: Phone, path: '/support' },
  { name: 'Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Automation', icon: Megaphone, path: '/automation' },
];

export default function Sidebar({ collapsed }) {
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

  const NavItem = ({ item }) => (
    <Link
      to={item.path}
      className={clsx(
        "flex items-center rounded-md transition-colors",
        collapsed
          ? "flex-col justify-center px-1 py-3 space-y-1 text-[10px]"
          : "space-x-3 px-3 py-2 text-sm",
        location.pathname === item.path
          ? "bg-blue-900/50 text-blue-400"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      )}
      title={collapsed ? '' : item.name}
    >
      <item.icon size={collapsed ? 20 : 18} />
      <span>{item.name}</span>
    </Link>
  );

  return (
    <div className={clsx(
      "bg-[#1e293b] text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-700 font-sans transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className={clsx("p-4 flex items-center bg-[#1e293b]", collapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <LayoutGrid size={20} className="text-white" />
          </div>
          {!collapsed && <h1 className="text-lg font-semibold text-white tracking-tight">CYBOMB CRM</h1>}
        </div>
        {!collapsed && (
          <button className="text-slate-400 hover:text-white">
            <LogOut size={18} className="transform rotate-180" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6 custom-scrollbar">

        {/* Main Items */}
        <div className="space-y-1">
          {mainItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Modules Section */}
        <div className="space-y-3">
          {!collapsed ? (
            <>
              <div className="flex items-center space-x-2 px-2">
                <LayoutGrid size={16} className="text-pink-500" />
                <span className="text-sm font-medium text-slate-100">Modules</span>
              </div>

              {/* Search Bar */}
              <div className="relative px-1">
                <Search size={14} className="absolute left-4 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 transition-colors placeholder-slate-500"
                />
              </div>

              <div className="space-y-1">
                {moduleItems.map((item) => (
                  <NavItem key={item.path} item={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-1 pt-2 border-t border-slate-700/50">
              <div className="flex flex-col items-center justify-center px-1 py-3 space-y-1 text-[10px] text-gray-300 hover:bg-gray-800 hover:text-white rounded-md cursor-pointer transition-colors">
                <LayoutGrid size={20} className="text-pink-500" />
                <span>Modules</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-700 bg-[#0f172a]">
        <div className={clsx("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white max-w-[100px] truncate">{user?.name || 'User'}</span>
                  <span className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ') || 'Admin'}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-slate-800"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-slate-800 flex flex-col items-center space-y-1"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
