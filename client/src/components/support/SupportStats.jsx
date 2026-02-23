import { STATUS_CONFIG } from '../../constants/supportConstants';

export default function SupportStats({ statusCounts, statusFilter, setStatusFilter }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {Object.entries(statusCounts).map(([key, count]) => (
        <button
          key={key}
          onClick={() => setStatusFilter(key)}
          className={`p-3 rounded-lg border text-center transition-all ${
            statusFilter === key
              ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
              : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
        >
          <div className="text-xl font-bold text-gray-800">{count}</div>
          <div className="text-xs text-gray-500 capitalize mt-0.5">
            {key === 'all' ? 'All' : STATUS_CONFIG[key]?.label || key}
          </div>
        </button>
      ))}
    </div>
  );
}
