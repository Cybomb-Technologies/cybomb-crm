const express = require('express');
const router = express.Router();
const { 
    createActivity, 
    getActivities, 
    getActivity, 
    updateActivity, 
    deleteActivity 
} = require('../controllers/activityController');
const { auth } = require('../middleware/authMiddleware');
const checkOrgAccess = require('../middleware/checkOrgAccess');
const Activity = require('../models/Activity');

router.use(auth);

router.post('/', createActivity);
router.get('/', getActivities);
router.get('/:id', checkOrgAccess(Activity), getActivity);
router.put('/:id', checkOrgAccess(Activity), updateActivity);
router.delete('/:id', checkOrgAccess(Activity), deleteActivity);

module.exports = router;
