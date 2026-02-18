import Layout from '../components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: '124', color: 'bg-blue-500' },
          { label: 'Open Deals', value: '45', color: 'bg-green-500' },
          { label: 'Revenue (M)', value: '$12.5k', color: 'bg-purple-500' },
          { label: 'Active Tasks', value: '8', color: 'bg-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
