const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  stage: {
    type: String,
    enum: ['Discovery', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Discovery',
  },
  probability: {
    type: Number,
    default: 10,
  },
  expectedCloseDate: {
    type: Date,
  },
  contactPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead', // Or Customer
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);
