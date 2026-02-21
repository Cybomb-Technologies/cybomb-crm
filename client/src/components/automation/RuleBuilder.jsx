import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

const MODULES = ['Lead', 'Deal', 'Customer', 'Activity', 'Ticket'];
const EVENTS = ['Created', 'Updated'];
const OPERATORS = ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'];
const ACTIONS = [
  { value: 'update_field', label: 'Update Field' },
  { value: 'assign_user', label: 'Assign User' },
  { value: 'create_task', label: 'Create Task' }
];

export default function RuleBuilder({ isOpen, onClose, ruleToEdit, onSave }) {
  const [formData, setFormData] = useState(
    ruleToEdit || {
      name: '',
      description: '',
      isActive: true,
      trigger: { module: 'Lead', event: 'Created' },
      conditions: [{ field: 'source', operator: 'equals', value: '' }],
      actions: [{ type: 'update_field', targetField: '', targetValue: '' }]
    }
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTriggerChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      trigger: { ...prev.trigger, [name]: value }
    }));
  };

  // Condition Handlers
  const handleConditionChange = (index, field, value) => {
    const newConditions = [...formData.conditions];
    newConditions[index][field] = value;
    setFormData(prev => ({ ...prev, conditions: newConditions }));
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: 'equals', value: '' }]
    }));
  };

  const removeCondition = (index) => {
    const newConditions = formData.conditions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, conditions: newConditions }));
  };

  // Action Handlers
  const handleActionChange = (index, field, value) => {
    const newActions = [...formData.actions];
    if (field === 'taskTemplate') {
      newActions[index].taskTemplate = { ...newActions[index].taskTemplate, ...value };
    } else {
        newActions[index][field] = value;
    }
    setFormData(prev => ({ ...prev, actions: newActions }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'update_field', targetField: '', targetValue: '' }]
    }));
  };

  const removeAction = (index) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, actions: newActions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (ruleToEdit && ruleToEdit._id) {
        await api.put(`/automations/${ruleToEdit._id}`, formData);
      } else {
        await api.post('/automations', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving rule:', error);
      alert(error.response?.data?.message || 'Failed to save automation rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {ruleToEdit ? 'Edit Automation Rule' : 'Create Automation Rule'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basic Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Assign High Value Deals"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="What does this rule do?"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Trigger */}
          <div className="space-y-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
            <h3 className="text-sm font-semibold text-purple-800 uppercase tracking-wider">1. When this happens (Trigger)</h3>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-xs font-medium text-purple-700 mb-1">Module</label>
                <select
                  name="module"
                  value={formData.trigger.module}
                  onChange={handleTriggerChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg outline-none bg-white font-medium text-gray-700"
                >
                  {MODULES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-purple-700 mb-1">Event</label>
                <select
                  name="event"
                  value={formData.trigger.event}
                  onChange={handleTriggerChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-lg outline-none bg-white font-medium text-gray-700"
                >
                  {EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
            <div className="flex justify-between items-center">
               <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider">2. If these conditions are met</h3>
               <button 
                type="button" 
                onClick={addCondition}
                className="text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
               >
                 <Plus size={14}/> Add Condition
               </button>
            </div>
            
            {formData.conditions.map((cond, index) => (
              <div key={index} className="flex gap-3 items-end bg-white p-3 rounded-lg border border-amber-200">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Field</label>
                  <input
                    type="text"
                    required
                    value={cond.field}
                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm"
                    placeholder="e.g. source"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Operator</label>
                  <select
                    value={cond.operator}
                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm bg-gray-50"
                  >
                    {OPERATORS.map(op => <option key={op} value={op}>{op.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                  <input
                    type="text"
                    required
                    value={cond.value}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm"
                    placeholder="e.g. Website"
                  />
                </div>
                {formData.conditions.length > 1 && (
                  <button type="button" onClick={() => removeCondition(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-4 bg-green-50 p-4 rounded-xl border border-green-100">
             <div className="flex justify-between items-center">
               <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wider">3. Then do this (Actions)</h3>
               <button 
                type="button" 
                onClick={addAction}
                className="text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
               >
                 <Plus size={14}/> Add Action
               </button>
            </div>

            {formData.actions.map((action, index) => (
              <div key={index} className="flex flex-col gap-3 bg-white p-3 rounded-lg border border-green-200">
                <div className="flex gap-3 items-end">
                    <div className="w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Action Type</label>
                    <select
                        value={action.type}
                        onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm font-medium text-gray-700 bg-gray-50"
                    >
                        {ACTIONS.map(act => <option key={act.value} value={act.value}>{act.label}</option>)}
                    </select>
                    </div>

                    {/* Dynamic Action Fields */}
                    {action.type === 'update_field' && (
                       <>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Target Field</label>
                            <input
                                type="text"
                                required
                                value={action.targetField || ''}
                                onChange={(e) => handleActionChange(index, 'targetField', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm"
                                placeholder="e.g. status"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">New Value</label>
                            <input
                                type="text"
                                required
                                value={action.targetValue || ''}
                                onChange={(e) => handleActionChange(index, 'targetValue', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm"
                                placeholder="e.g. Qualified"
                            />
                        </div>
                       </>
                    )}

                    {action.type === 'assign_user' && (
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">User ID</label>
                            <input
                                type="text"
                                required
                                value={action.targetValue || ''}
                                onChange={(e) => handleActionChange(index, 'targetValue', e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm"
                                placeholder="User Object ID"
                            />
                        </div>
                    )}

                    {formData.actions.length > 1 && (
                    <button type="button" onClick={() => removeAction(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                    </button>
                    )}
                </div>

                {action.type === 'create_task' && (
                    <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-green-100 mt-2">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Task Subject</label>
                            <input
                                type="text"
                                required
                                value={action.taskTemplate?.subject || ''}
                                onChange={(e) => handleActionChange(index, 'taskTemplate', { subject: e.target.value })}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm"
                                placeholder="e.g. Follow up on proposal"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Days Until Due</label>
                            <input
                                type="number"
                                required
                                value={action.taskTemplate?.daysUntilDue || 0}
                                onChange={(e) => handleActionChange(index, 'taskTemplate', { daysUntilDue: parseInt(e.target.value) })}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none text-sm"
                            />
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
