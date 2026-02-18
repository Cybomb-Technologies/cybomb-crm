import Layout from '../components/Layout';

export default function Reports() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
          <p className="text-gray-500">Sales Pipeline Chart</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
           <p className="text-gray-500">Revenue Growth Chart</p>
        </div>
      </div>
    </Layout>
  );
}
