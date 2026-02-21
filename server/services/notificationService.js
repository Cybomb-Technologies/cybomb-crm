const Notification = require('../models/Notification');

/**
 * Creates an in-app notification for a specific user.
 * @param {ObjectId} orgId - The organization ID.
 * @param {ObjectId} userId - The target user ID.
 * @param {string} title - Actionable short title.
 * @param {string} message - Detail message.
 * @param {string} type - 'info', 'success', 'warning', 'error'
 * @param {string} link - Optional relative URL to redirect on click
 */
exports.createNotification = async (orgId, userId, title, message = '', type = 'info', link = null) => {
  try {
    if (!orgId || !userId || !title) return;

    await Notification.create({
      organization: orgId,
      user: userId,
      title,
      message,
      type,
      link
    });
  } catch (error) {
    console.error('Notification Creation Failed:', error.message);
  }
};
