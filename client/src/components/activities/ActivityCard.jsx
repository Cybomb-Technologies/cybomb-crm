import { FileText, Clock } from 'lucide-react';
import { TYPE_CONFIG, STATUS_CONFIG } from '../../constants/activityConstants';

export default function ActivityCard({ activity }) {
  const TypeIcon = TYPE_CONFIG[activity.type]?.icon || FileText;
  const typeColor = TYPE_CONFIG[activity.type]?.color || 'bg-gray-100 text-gray-600';
  const StatusIcon = STATUS_CONFIG[activity.status]?.icon || Clock;
  const statusColor = STATUS_CONFIG[activity.status]?.color || 'bg-gray-100 text-gray-600';
  const statusLabel = STATUS_CONFIG[activity.status]?.label || activity.status;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColor}`}>
          <TypeIcon size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-gray-900 text-sm">{activity.subject}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0 ${statusColor}`}>
              <StatusIcon size={12} />
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {' '}
              {new Date(activity.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>•</span>
            <span>{activity.relatedTo}</span>
            <span>•</span>
            <span>{activity.assignedTo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
