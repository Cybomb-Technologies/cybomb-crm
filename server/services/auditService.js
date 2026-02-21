const AuditLog = require('../models/AuditLog');

/**
 * Creates an Audit Log entry.
 * @param {object} req - The Express request object (needs req.user).
 * @param {string} entityType - The model name (e.g., 'Lead', 'Deal').
 * @param {string|ObjectId} entityId - The ID of the affected document.
 * @param {string} action - 'CREATE', 'UPDATE', or 'DELETE'.
 * @param {object} changes - Object detailing the changes (optional).
 */
exports.createLog = async (req, entityType, entityId, action, changes = {}) => {
  try {
    if (!req.user || !req.user.organization) return; // Fail silently if no context

    await AuditLog.create({
      organization: req.user.organization,
      user: req.user.id,
      entityType,
      entityId,
      action,
      changes
    });
  } catch (error) {
    console.error('Audit Logging Failed:', error.message);
    // Non-blocking: we don't want the main request to fail if logging fails
  }
};
