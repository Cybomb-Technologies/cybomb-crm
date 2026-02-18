import { MoreHorizontal } from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants/supportConstants';

export default function SupportTicketRow({ ticket }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 text-sm">{ticket.subject}</div>
        <div className="text-xs text-gray-400 mt-0.5">{ticket.category}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{ticket.customer}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[ticket.status]?.color || 'bg-gray-100 text-gray-600'}`}>
          {STATUS_CONFIG[ticket.status]?.label || ticket.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_CONFIG[ticket.priority]?.color || 'bg-gray-100 text-gray-600'}`}>
          {PRIORITY_CONFIG[ticket.priority]?.label || ticket.priority}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTo}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </td>
      <td className="px-6 py-4 text-right">
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
          <MoreHorizontal size={20} />
        </button>
      </td>
    </tr>
  );
}
