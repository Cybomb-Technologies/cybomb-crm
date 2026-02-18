import Layout from '../components/Layout';
import { Plus, Zap, ArrowRight, MoreHorizontal, Play, Pause, Mail, UserPlus, FileEdit, Bell } from 'lucide-react';
import { useState } from 'react';

const actionIcons = {
  send_email: Mail,
  create_task: FileEdit,
  assign_user: UserPlus,
  notify: Bell,
};

const dummyAutomations = [
  {
    id: 1,
    name: 'Auto-Assign New Leads',
    trigger: { event: 'lead_created', model: 'Lead' },
    conditions: [{ field: 'source', operator: 'equals', value: 'Website' }],
    actions: [{ type: 'assign_user', params: { user: 'Round Robin' } }, { type: 'send_email', params: { template: 'welcome' } }],
    isActive: true,
    createdAt: '2024-03-01',
  },
  {
    id: 2,
    name: 'Stale Deal Reminder',
    trigger: { event: 'time_elapsed', model: 'Deal' },
    conditions: [{ field: 'days_in_stage', operator: 'greater_than', value: 7 }],
    actions: [{ type: 'notify', params: { message: 'Deal has been stale for 7+ days' } }],
    isActive: true,
    createdAt: '2024-03-10',
  },
  {
    id: 3,
    name: 'Won Deal → Create Customer',
    trigger: { event: 'status_change', model: 'Deal' },
    conditions: [{ field: 'stage', operator: 'equals', value: 'Closed Won' }],
    actions: [{ type: 'create_task', params: { title: 'Onboard customer' } }, { type: 'send_email', params: { template: 'congrats' } }],
    isActive: false,
    createdAt: '2024-03-15',
  },
  {
    id: 4,
    name: 'High Priority Ticket Alert',
    trigger: { event: 'record_created', model: 'Ticket' },
    conditions: [{ field: 'priority', operator: 'equals', value: 'urgent' }],
    actions: [{ type: 'notify', params: { channel: 'slack' } }, { type: 'assign_user', params: { user: 'Senior Agent' } }],
    isActive: true,
    createdAt: '2024-04-01',
  },
];

function formatEvent(event) {
  return event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function Automation() {
  const [automations, setAutomations] = useState(dummyAutomations);

  const toggleActive = (id) => {
    setAutomations(prev =>
      prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
    );
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Automation Rules</h1>
          <p className="text-sm text-gray-500 mt-1">{automations.filter(a => a.isActive).length} active out of {automations.length} rules</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={20} />
          New Rule
        </button>
      </div>

      <div className="grid gap-4">
        {automations.map((rule) => (
          <div key={rule.id} className={`bg-white rounded-xl border shadow-sm p-5 transition-all group ${rule.isActive ? 'border-gray-100 hover:shadow-md' : 'border-gray-100 opacity-60'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{rule.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Created {new Date(rule.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(rule.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                    rule.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {rule.isActive ? <Play size={12} /> : <Pause size={12} />}
                  {rule.isActive ? 'Active' : 'Paused'}
                </button>
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Flow: Trigger → Conditions → Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Trigger */}
              <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-100">
                <Zap size={12} />
                <span>{formatEvent(rule.trigger.event)}</span>
                <span className="text-purple-400">on</span>
                <span>{rule.trigger.model}</span>
              </div>

              <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />

              {/* Conditions */}
              {rule.conditions.map((cond, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-100">
                  <span>{cond.field}</span>
                  <span className="text-amber-400">{cond.operator.replace(/_/g, ' ')}</span>
                  <span>"{String(cond.value)}"</span>
                </div>
              ))}

              <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />

              {/* Actions */}
              {rule.actions.map((action, i) => {
                const ActionIcon = actionIcons[action.type] || Bell;
                return (
                  <div key={i} className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-green-100">
                    <ActionIcon size={12} />
                    <span>{action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
