const express = require('express');
const router = express.Router();
const { createDeal, getDeals, updateDeal, deleteDeal } = require('../controllers/dealController');
const { auth } = require('../middleware/authMiddleware');
const checkOrgAccess = require('../middleware/checkOrgAccess');
const Deal = require('../models/Deal');

router.use(auth);

router.post('/', createDeal);
router.get('/', getDeals);
router.put('/:id', checkOrgAccess(Deal), updateDeal);
router.delete('/:id', checkOrgAccess(Deal), deleteDeal);

module.exports = router;
