const express = require('express');
const router = express.Router();
const { createDeal, getDeals, updateDeal, deleteDeal } = require('../controllers/dealController');
const { auth, authorize } = require('../middleware/authMiddleware');
const checkOrgAccess = require('../middleware/checkOrgAccess');
const Deal = require('../models/Deal');

router.use(auth);

router.post('/', authorize('org_admin', 'sales_manager', 'sales_executive'), createDeal);
router.get('/', authorize('org_admin', 'sales_manager', 'sales_executive'), getDeals);
router.put('/:id', checkOrgAccess(Deal), authorize('org_admin', 'sales_manager', 'sales_executive'), updateDeal);
router.delete('/:id', checkOrgAccess(Deal), authorize('org_admin', 'sales_manager'), deleteDeal);

module.exports = router;
