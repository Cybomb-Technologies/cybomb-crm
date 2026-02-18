import Layout from '../components/Layout';

export default function Settings() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-700">User Management</h3>
           <p className="text-sm text-gray-500 mt-2">Manage users and roles.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-700">Pipeline Config</h3>
           <p className="text-sm text-gray-500 mt-2">Customize deal stages.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-700">Organization</h3>
           <p className="text-sm text-gray-500 mt-2">Update company details.</p>
        </div>
      </div>
    </Layout>
  );
}
