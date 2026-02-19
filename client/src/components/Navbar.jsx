import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Search,
    Plus,
    Calendar,
    Store,
    Settings,
    LayoutGrid,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ hideTitle = false }) {
    const location = useLocation();
    const { user } = useAuth();
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const quickCreateRef = useRef(null);

    // ... (keep existing useEffect)

    // Map routes to display names
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Home';

        // Remove leading slash and capitalize
        const title = path.substring(1);
        return title.charAt(0).toUpperCase() + title.slice(1);
    };

    const NavIcon = ({ icon: Icon, title }) => (
        <div className="relative group">
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative">
                <Icon size={20} />
            </button>
            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                {title}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
            </div>
        </div>
    );

    const quickCreateItems = [
        'Lead', 'Contact', 'Account', 'Deal', 'Task', 'Meeting', 'Call', 'Campaign'
    ];

    return (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">

            {/* Left: Page Title */}
            {!hideTitle && (
                <h1 className="text-xl font-semibold text-slate-800">
                    {getPageTitle()}
                </h1>
            )}
            {hideTitle && <div></div>} {/* Spacer to keep flex justification working if needed, though justify-between handles single item too */}

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">

                {/* Search Bar */}
                <div className="relative hidden md:block w-64 mr-4">
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search records"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg py-1.5 pl-9 pr-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Quick Create Button & Dropdown */}
                <div className="relative mr-2" ref={quickCreateRef}>
                    <button
                        onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                        className={`p-1.5 rounded-lg transition-colors shadow-sm flex items-center justify-center border ${isQuickCreateOpen ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border-blue-200'}`}
                    >
                        <Plus size={20} className={isQuickCreateOpen ? 'transform rotate-45 transition-transform' : 'transition-transform'} />
                    </button>

                    {!isQuickCreateOpen && (
                        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                            Quick Create
                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                    )}

                    {/* Quick Create Dropdown */}
                    {isQuickCreateOpen && (
                        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-sm font-semibold text-slate-800">Quick Create</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Add records instantly.</p>
                            </div>

                            <div className="p-3">
                                <p className="text-xs font-medium text-slate-700 mb-2">Create Records</p>
                                <div className="relative mb-3">
                                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full bg-white border border-blue-100 rounded-md py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        autoFocus
                                    />
                                </div>

                                <div className="space-y-1">
                                    {quickCreateItems.map((item) => (
                                        <button
                                            key={item}
                                            className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-md transition-colors group"
                                        >
                                            <div className="w-5 h-5 flex items-center justify-center rounded bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <Plus size={12} />
                                            </div>
                                            <span>{item}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Link to="/calendar">
                    <NavIcon icon={Calendar} title="Calendar" />
                </Link>
                <NavIcon icon={Store} title="Marketplace" />
                <NavIcon icon={Settings} title="Setup" />

                {/* User Profile */}
                <div className="relative group mx-2">
                    <button className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200 hover:ring-2 hover:ring-indigo-100 transition-all overflow-hidden">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </button>
                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 right-0 px-3 py-1.5 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                        Profile
                        <div className="absolute -top-1 right-3 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                </div>

                <NavIcon icon={LayoutGrid} title="Applications" />

            </div>
        </div>
    );
}
