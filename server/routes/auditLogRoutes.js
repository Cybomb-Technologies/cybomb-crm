const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditLogController');
const { auth, authorize } = require('../middleware/authMiddleware');

// @route   GET api/audit-logs
// @desc    Get all audit logs for the organization
// @access  Private (Org Admin only)
router.get('/', auth, authorize('org_admin'), getAuditLogs);

module.exports = router;
