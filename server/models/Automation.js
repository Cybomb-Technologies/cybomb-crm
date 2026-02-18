const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trigger: {
    event: { type: String, required: true }, // e.g., 'lead_created', 'status_change', 'time_elapsed'
    model: { type: String, required: true }, // 'Lead', 'Deal'
  },
  conditions: [{
    field: String,
    operator: String, // 'equals', 'greater_than', 'contains'
    value: mongoose.Schema.Types.Mixed,
  }],
  actions: [{
    type: { type: String, required: true }, // 'send_email', 'create_task', 'update_field'
    params: mongoose.Schema.Types.Mixed,
  }],
  isActive: { type: Boolean, default: true },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

module.exports = mongoose.model('Automation', automationSchema);
