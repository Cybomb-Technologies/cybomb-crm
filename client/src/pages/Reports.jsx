import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import api from '../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function Reports() {
  const [pipelineData, setPipelineData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [pipelineRes, revenueRes, leadRes, leaderRes] = await Promise.all([
          api.get('/reports/pipeline'),
          api.get('/reports/revenue'),
          api.get('/reports/leads'),
          api.get('/reports/performance')
        ]);
        
        setPipelineData(pipelineRes.data);
        setRevenueData(revenueRes.data);
        setLeadData(leadRes.data);
        setLeaderboard(leaderRes.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
           <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  // Calculate some simple summaries if data exists
  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalLeads = leadData.reduce((acc, curr) => acc + curr.value, 0);
  const totalWonDeals = leaderboard.reduce((acc, curr) => acc + curr.wonDeals, 0);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time organizational insights</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Expected Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Deals Won</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalWonDeals}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Leads</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalLeads}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Win Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {pipelineData.length ? Math.round((pipelineData.find(p => p.stage === 'Closed Won')?.count || 0) / (pipelineData.reduce((acc, c) => acc + c.count, 0) || 1) * 100) : 0}%
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Revenue Forecast */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Forecast (Current Year)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Pipeline</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={90} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Lead Status Distribution</h3>
          <div className="h-full pb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {leadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {leadData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
          <div className="p-6 border-b border-gray-100">
             <h3 className="text-lg font-bold text-gray-800">Sales Leaderboard</h3>
          </div>
          <div className="p-0 overflow-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-500 font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3">Rep Name</th>
                  <th className="px-6 py-3 text-center">Deals Won</th>
                  <th className="px-6 py-3 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.length === 0 ? (
                    <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-400">No data available for leaderboard.</td>
                    </tr>
                ) : leaderboard.map((rep, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {rep.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{rep.name}</p>
                          <p className="text-xs text-gray-500">{rep.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-medium">{rep.wonDeals}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ${rep.totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
