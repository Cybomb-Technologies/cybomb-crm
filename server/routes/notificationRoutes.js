const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { auth } = require('../middleware/authMiddleware');

// Get notifications
router.get('/', auth, getNotifications);

// Mark specific or all notification as read
router.put('/:id/read', auth, markAsRead);

module.exports = router;
