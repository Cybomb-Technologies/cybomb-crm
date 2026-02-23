const express = require('express');
const router = express.Router();
const { 
    createRule, 
    getRules, 
    getRuleById, 
    updateRule, 
    deleteRule 
} = require('../controllers/automationController');
const { auth, authorize } = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', authorize('org_admin'), createRule);
router.get('/', authorize('org_admin'), getRules);
router.get('/:id', authorize('org_admin'), getRuleById);
router.put('/:id', authorize('org_admin'), updateRule);
router.delete('/:id', authorize('org_admin'), deleteRule);

module.exports = router;
