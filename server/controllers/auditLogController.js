const AuditLog = require('../models/AuditLog');

// Get All Audit Logs (Org Scoped) with Pagination & Filters
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, entityType, user, action } = req.query;

    const query = { organization: req.user.organization };

    // Filters
    if (entityType) query.entityType = entityType;
    if (user) query.user = user;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
