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

router.use(auth);

router.post('/', createActivity);
router.get('/', getActivities);
router.get('/:id', getActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
