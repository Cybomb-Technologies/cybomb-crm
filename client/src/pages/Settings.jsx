import {
  Search,
  Settings,
  Shield,
  MessageSquare,
  Palette,
  Zap,
  Database,
  Store,
  Code2,
  Plus,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import Layout from '../components/Layout';

export default function SettingsPage() {
  const settingsGroups = [
    {
      title: "General",
      icon: Settings,
      items: ["Personal Settings", "Users", "Company Settings"]
    },
    {
      title: "Security Control",
      icon: Shield,
      items: ["Profiles", "Roles and Sharing", "Compliance Settings", "Support Access"]
    },
    {
      title: "Channels",
      icon: MessageSquare,
      items: ["Email", "Notification SMS", "Webforms", "Chat"]
    },
    {
      title: "Customization",
      icon: Palette,
      items: ["Modules and Fields", "Customize Home page", "Templates"]
    },
    {
      title: "Automation",
      icon: Zap,
      items: ["Workflow Rules", "Actions"]
    },
    {
      title: "Data Administration",
      icon: Database,
      items: ["Import", "Export", "Data Backup", "Remove sample data", "Storage", "Recycle Bin"]
    },
    {
      title: "Marketplace",
      icon: Store,
      items: ["Cybomb", "Microsoft"]
    },
    {
      title: "Developer Hub",
      icon: Code2,
      items: ["APIs and SDKs", "Catalyst Solutions"]
    }
  ];

  return (
    <Layout>
      <div className="flex bg-gray-50 min-h-full">
        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <div className="relative w-96">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Settings"
                className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>

          {/* Setup Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {settingsGroups.map((group, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-start mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <group.icon size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-800 mt-1">{group.title}</h3>
                </div>
                <div className="space-y-2 ml-11">
                  {group.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600 hover:text-blue-600 hover:underline cursor-pointer transition-colors block">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}
