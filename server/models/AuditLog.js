const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true // Fast filtering by org
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entityType: {
    type: String,
    enum: ['Lead', 'Deal', 'Customer', 'Ticket', 'User'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed, // Stores { fieldName: { old: 'X', new: 'Y' } }
    default: {}
  }
}, { timestamps: true });

// Index for chronological ordering
auditLogSchema.index({ organization: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
