const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['call', 'meeting', 'email', 'task', 'note'],
    required: true,
  },
  subject: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true }, // Due date or event date
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  relatedTo: {
    onModel: {
      type: String,
      required: true,
      enum: ['Lead', 'Deal', 'Customer', 'Ticket']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'relatedTo.onModel'
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
     type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
