const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');
const { auth } = require('../middleware/authMiddleware');

// @route   GET api/search
// @desc    Global search across Leads, Deals, Customers, and Tickets
// @access  Private (All authenticated users can use search; scoped to org in controller)
router.get('/', auth, globalSearch);

module.exports = router;
