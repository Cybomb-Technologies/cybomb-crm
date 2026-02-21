const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Protect all report routes with auth and RBAC
router.use(auth);
router.use(authorize('org_admin', 'sales_manager'));

// @route   GET /api/reports/pipeline
// @desc    Get deal pipeline summary
router.get('/pipeline', reportController.getPipelineSummary);

// @route   GET /api/reports/revenue
// @desc    Get revenue forecast by month
router.get('/revenue', reportController.getRevenueForecast);

// @route   GET /api/reports/leads
// @desc    Get lead status distribution
router.get('/leads', reportController.getLeadDistribution);

// @route   GET /api/reports/performance
// @desc    Get sales rep leaderboard
router.get('/performance', reportController.getSalesLeaderboard);

module.exports = router;
