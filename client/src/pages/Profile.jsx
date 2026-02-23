import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { User, Mail, Shield, LogOut } from 'lucide-react';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-gray-500">Loading user profile...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header section with blue gradient background */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    <div className="px-8 pb-8">
                        {/* Avatar positioned over the header border */}
                        <div className="relative -mt-16 mb-6 flex justify-between items-end">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center shadow-md">
                                <span className="text-5xl font-bold text-indigo-600">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 text-lg mt-1">
                                {user.role === 'org_admin' ? 'Organization Admin' :
                                    user.role === 'super_admin' ? 'Super Administrator' :
                                        user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">System Role</p>
                                    <p className="text-base font-semibold text-gray-900 mt-1 capitalize">
                                        {user.role.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
