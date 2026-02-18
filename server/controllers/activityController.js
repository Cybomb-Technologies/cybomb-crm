const Activity = require('../models/Activity');

// Create Activity
exports.createActivity = async (req, res) => {
  try {
    const { type, subject, description, date, status, relatedTo, assignedTo } = req.body;

    const newActivity = new Activity({
      type,
      subject,
      description,
      date,
      status,
      relatedTo,
      assignedTo,
      createdBy: req.user.id,
      organization: req.user.organization // Enforce Org Isolation
    });

    const activity = await newActivity.save();
    res.status(201).json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Activities (Org Scoped)
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ organization: req.user.organization })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ date: 1 }); // Sort by due date ascending
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Single Activity
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check Org access
    if (activity.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update Activity
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check Org access
    if (activity.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Activity
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check Org access
    if (activity.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await activity.deleteOne();
    res.json({ message: 'Activity removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
