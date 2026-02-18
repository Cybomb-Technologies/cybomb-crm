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
    const activity = req.resource; // From middleware
    await activity.populate('assignedTo', 'name email');
    await activity.populate('createdBy', 'name email');

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Activity
exports.updateActivity = async (req, res) => {
  try {
    let activity = req.resource; // From middleware

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
    const activity = req.resource; // From middleware
    await activity.deleteOne();
    res.json({ message: 'Activity removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
