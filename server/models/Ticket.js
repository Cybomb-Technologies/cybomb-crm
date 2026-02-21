const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const ticketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  category: { type: String },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Link to Customer
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
  // Future: Messages array or separate Message model linked to Ticket
}, { timestamps: true });

ticketSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Ticket', ticketSchema);
