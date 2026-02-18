import Layout from '../components/Layout';
import { Plus, MoreHorizontal, DollarSign, Calendar } from 'lucide-react';
import clsx from 'clsx';

const stages = ['Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed Won'];

const dummyDeals = [
  { id: 1, title: 'Acme Corp Software License', value: 12000, stage: 'Discovery', owner: 'Jane Doe', company: 'Acme Corp' },
  { id: 2, title: 'Global Traders Expansion', value: 45000, stage: 'Proposal', owner: 'Mike Ross', company: 'Global Traders' },
  { id: 3, title: 'TechStart seed deal', value: 5000, stage: 'Demo', owner: 'Jane Doe', company: 'TechStart' },
  { id: 4, title: 'Enterprise Plan - BigCo', value: 85000, stage: 'Negotiation', owner: 'John Smith', company: 'BigCo' },
  { id: 5, title: 'Small Business Plan', value: 1200, stage: 'Discovery', owner: 'Sarah Lee', company: 'Mom&Pop' },
];

export default function Deals() {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Deals Pipeline</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          New Deal
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-140px)]">
        {stages.map((stage) => (
          <div key={stage} className="min-w-[300px] flex-shrink-0 bg-gray-100/50 rounded-xl p-3 border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-semibold text-gray-700 text-sm">{stage}</h3>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {dummyDeals.filter(d => d.stage === stage).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {dummyDeals
                .filter((deal) => deal.stage === stage)
                .map((deal) => (
                  <div key={deal.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{deal.title}</h4>
                       <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                         <MoreHorizontal size={16} />
                       </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{deal.company}</p>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <div className="flex items-center text-gray-600 text-xs font-semibold">
                        <DollarSign size={12} className="mr-0.5" />
                        {deal.value.toLocaleString()}
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Calendar size={12} className="mr-1" />
                        Oct 24
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
