const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'linkedin', 'cold_call', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  notes: {
    type: String,
  },
  tags: [{
    type: String
  }]
}, { timestamps: true });

leadSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Lead', leadSchema);
