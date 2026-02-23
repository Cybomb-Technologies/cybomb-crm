import { TYPE_CONFIG, ACTIVITY_TABS } from '../../constants/activityConstants';

export default function ActivityFilters({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
      {ACTIVITY_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
            activeTab === tab
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab === 'all' ? 'All' : TYPE_CONFIG[tab]?.label || tab}
        </button>
      ))}
    </div>
  );
}
