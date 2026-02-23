const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Fast lookup for a user's notifications
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  },
  link: {
    type: String, // Optional URL to redirect to (e.g., /deals/123)
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for getting unread notifications quickly
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
