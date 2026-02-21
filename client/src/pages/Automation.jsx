import Layout from '../components/Layout';
import { Plus, Zap, ArrowRight, MoreHorizontal, Play, Pause, FileEdit, UserPlus, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import RuleBuilder from '../components/automation/RuleBuilder';

const actionIcons = {
  update_field: FileEdit,
  create_task: FileEdit,
  assign_user: UserPlus,
};

function formatEvent(event) {
  if (!event) return '';
  return event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function Automation() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/automations');
      setAutomations(res.data);
    } catch (err) {
      console.error('Error fetching automations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  const toggleActive = async (rule) => {
    try {
      await api.put(`/automations/${rule._id}`, { isActive: !rule.isActive });
      fetchAutomations();
    } catch (err) {
      console.error('Error updating automation:', err);
      alert('Failed to update rule status');
    }
  };

  const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this rule?")) {
          try {
              await api.delete(`/automations/${id}`);
              fetchAutomations();
          } catch(err) {
              console.error('Error deleting automation:', err);
              alert('Failed to delete rule');
          }
      }
  }

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setIsBuilderOpen(true);
  };

  const handleNew = () => {
    setSelectedRule(null);
    setIsBuilderOpen(true);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Automation Rules</h1>
          <p className="text-sm text-gray-500 mt-1">{automations.filter(a => a.isActive).length} active out of {automations.length} rules</p>
        </div>
        <button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
          <Plus size={20} />
          New Rule
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
            {automations.map((rule) => (
            <div key={rule._id} className={`bg-white rounded-xl border shadow-sm p-5 transition-all group ${rule.isActive ? 'border-gray-100 hover:shadow-md' : 'border-gray-100 opacity-60'}`}>
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
                    onClick={() => toggleActive(rule)}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
                        rule.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    >
                    {rule.isActive ? <Play size={12} /> : <Pause size={12} />}
                    {rule.isActive ? 'Active' : 'Paused'}
                    </button>
                    <div className="flex items-center ml-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEdit(rule)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit size={16} />
                         </button>
                         <button onClick={() => handleDelete(rule._id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 size={16} />
                         </button>
                    </div>
                </div>
                </div>

                {/* Flow: Trigger → Conditions → Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                {/* Trigger */}
                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-100">
                    <Zap size={12} />
                    <span>{formatEvent(rule.trigger?.event)}</span>
                    <span className="text-purple-400">on</span>
                    <span>{rule.trigger?.module}</span>
                </div>

                <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />

                {/* Conditions */}
                {rule.conditions?.map((cond, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-100">
                    <span>{cond.field}</span>
                    <span className="text-amber-400">{cond.operator.replace(/_/g, ' ')}</span>
                    <span>"{String(cond.value)}"</span>
                    </div>
                ))}

                <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />

                {/* Actions */}
                {rule.actions?.map((action, i) => {
                    const ActionIcon = actionIcons[action.type] || LinkIcon;
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
            {automations.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
                    No automation rules defined yet. Click "New Rule" to create one.
                </div>
            )}
        </div>
      )}

      <RuleBuilder 
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        ruleToEdit={selectedRule}
        onSave={fetchAutomations}
      />
    </Layout>
  );
}
