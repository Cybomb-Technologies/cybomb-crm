const express = require('express');
const router = express.Router();
const { createLead, getLeads, getLead, updateLead, deleteLead, deleteLeads, exportLeads, importLeads } = require('../controllers/leadController');
const { auth } = require('../middleware/authMiddleware');
const checkOrgAccess = require('../middleware/checkOrgAccess');
const Lead = require('../models/Lead');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// All routes are protected
router.use(auth);

router.post('/', createLead);
router.get('/', getLeads);
router.get('/export', exportLeads);
router.post('/import', upload.single('file'), importLeads);
router.get('/:id', checkOrgAccess(Lead), getLead);
router.put('/:id', checkOrgAccess(Lead), updateLead);
router.delete('/:id', checkOrgAccess(Lead), deleteLead);
router.post('/bulk-delete', deleteLeads);

module.exports = router;
