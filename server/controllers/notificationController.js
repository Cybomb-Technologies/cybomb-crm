const Notification = require('../models/Notification');

// Get current user's notifications (default to unread only, or all via query param)
exports.getNotifications = async (req, res) => {
  try {
    const { filter = 'unread', limit = 20 } = req.query;
    
    const query = { 
      organization: req.user.organization,
      user: req.user.id
    };

    if (filter === 'unread') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    // Also get the total unread count for badge display
    const unreadCount = await Notification.countDocuments({
      organization: req.user.organization,
      user: req.user.id,
      isRead: false
    });

    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Mark a specific notification as read, or all of them if no ID provided
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (id && id !== 'all') {
      // Mark specific notification as read
      const notification = await Notification.findOneAndUpdate(
        { _id: id, user: req.user.id, organization: req.user.organization },
        { $set: { isRead: true } },
        { new: true }
      );
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      return res.json(notification);
    } else {
      // Mark ALL as read
      await Notification.updateMany(
        { user: req.user.id, organization: req.user.organization, isRead: false },
        { $set: { isRead: true } }
      );
      return res.json({ message: 'All notifications marked as read' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
