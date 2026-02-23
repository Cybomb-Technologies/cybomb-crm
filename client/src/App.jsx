import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import CommandPalette from './components/CommandPalette';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Deals from './pages/Deals';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Activities from './pages/Activities';
import Support from './pages/Support';
import Reports from './pages/Reports';
import Automation from './pages/Automation';
import Settings from './pages/Settings';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import RecycleBin from './pages/RecycleBin';
import NotificationsDemo from './pages/NotificationsDemo';
import Login from './pages/Login';
import Register from './pages/Register';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <>
      <CommandPalette />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected Routes - Accessible by all authenticated users */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>

      {/* Role Protected Routes */}
      <Route path="/leads" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager', 'sales_executive', 'marketing']}><Leads /></RoleProtectedRoute>} />
      <Route path="/leads/:id" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager', 'sales_executive', 'marketing']}><LeadDetails /></RoleProtectedRoute>} />
      
      <Route path="/deals" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager', 'sales_executive']}><Deals /></RoleProtectedRoute>} />
      
      <Route path="/customers" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager', 'sales_executive', 'support_agent']}><Customers /></RoleProtectedRoute>} />
      <Route path="/customers/:id" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager', 'sales_executive', 'support_agent']}><CustomerDetails /></RoleProtectedRoute>} />
      
      <Route path="/activities" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager', 'sales_executive', 'support_agent']}><Activities /></RoleProtectedRoute>} />
      
      <Route path="/support" element={<RoleProtectedRoute allowedRoles={['org_admin', 'support_agent', 'sales_manager', 'sales_executive']}><Support /></RoleProtectedRoute>} />
      
      <Route path="/reports" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager']}><Reports /></RoleProtectedRoute>} />
      
      <Route path="/automation" element={<RoleProtectedRoute allowedRoles={['org_admin']}><Automation /></RoleProtectedRoute>} />
      <Route path="/settings" element={<RoleProtectedRoute allowedRoles={['org_admin']}><Settings /></RoleProtectedRoute>} />
      <Route path="/users" element={<RoleProtectedRoute allowedRoles={['org_admin', 'sales_manager']}><Users /></RoleProtectedRoute>} />
      <Route path="/audit-logs" element={<RoleProtectedRoute allowedRoles={['org_admin']}><AuditLogs /></RoleProtectedRoute>} />
      <Route path="/recycle-bin" element={<RoleProtectedRoute allowedRoles={['org_admin']}><RecycleBin /></RoleProtectedRoute>} />
      <Route path="/notifications-demo" element={<ProtectedRoute><NotificationsDemo /></ProtectedRoute>} />
      
      {/* Catch-all route to redirect unknown URLs to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
