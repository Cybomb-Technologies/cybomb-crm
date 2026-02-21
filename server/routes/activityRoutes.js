const express = require('express');
const router = express.Router();
const { 
    createActivity, 
    getActivities, 
    getActivity, 
    updateActivity, 
    deleteActivity 
} = require('../controllers/activityController');
const { auth, authorize } = require('../middleware/authMiddleware');
const checkOrgAccess = require('../middleware/checkOrgAccess');
const Activity = require('../models/Activity');

router.use(auth);

router.post('/', authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), createActivity);
router.get('/', authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), getActivities);
router.get('/:id', checkOrgAccess(Activity), authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), getActivity);
router.put('/:id', checkOrgAccess(Activity), authorize('org_admin', 'sales_manager', 'sales_executive', 'support_agent'), updateActivity);
router.delete('/:id', checkOrgAccess(Activity), authorize('org_admin', 'sales_manager'), deleteActivity);

module.exports = router;
