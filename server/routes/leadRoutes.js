const express = require('express');
const router = express.Router();
const { createLead, getLeads, getLead, updateLead, deleteLead } = require('../controllers/leadController');
const { auth } = require('../middleware/authMiddleware');
const checkOrgAccess = require('../middleware/checkOrgAccess');
const Lead = require('../models/Lead');

// All routes are protected
router.use(auth);

router.post('/', createLead);
router.get('/', getLeads);
router.get('/:id', checkOrgAccess(Lead), getLead);
router.put('/:id', checkOrgAccess(Lead), updateLead);
router.delete('/:id', checkOrgAccess(Lead), deleteLead);

module.exports = router;
