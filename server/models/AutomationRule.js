const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  trigger: {
    module: {
      type: String,
      enum: ['Lead', 'Deal', 'Customer', 'Activity', 'Ticket'],
      required: true
    },
    event: {
      type: String,
      enum: ['Created', 'Updated', 'Deleted'],
      required: true
    }
  },
  conditions: [{
    field: {
      type: String,
      required: true // e.g., 'source', 'value', 'stage', 'priority'
    },
    operator: {
      type: String,
      enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'],
      required: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  }],
  actions: [{
    type: {
      type: String,
      enum: ['update_field', 'create_task', 'assign_user'],
      required: true
    },
    targetField: {
      type: String // Required if type is 'update_field'
    },
    targetValue: {
      type: mongoose.Schema.Types.Mixed // Required if type is 'update_field' or 'assign_user'
    },
    taskTemplate: {
       subject: String,
       description: String,
       daysUntilDue: Number
       // Used if type is 'create_task'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate rule names per organization
automationRuleSchema.index({ organization: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('AutomationRule', automationRuleSchema);
