const Automation = require('../models/Automation');

// Create Automation
exports.createAutomation = async (req, res) => {
  try {
    const { name, trigger, conditions, actions, isActive } = req.body;

    const newAutomation = new Automation({
      name,
      trigger,
      conditions,
      actions,
      isActive,
      createdBy: req.user.id,
      organization: req.user.organization // Enforce Org Isolation
    });

    const automation = await newAutomation.save();
    res.status(201).json(automation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Automations (Org Scoped)
exports.getAutomations = async (req, res) => {
  try {
    const automations = await Automation.find({ organization: req.user.organization })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(automations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Single Automation
exports.getAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }

    // Check Org access
    if (automation.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(automation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Automation not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update Automation
exports.updateAutomation = async (req, res) => {
  try {
    let automation = await Automation.findById(req.params.id);

    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }

    // Check Org access
    if (automation.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    automation = await Automation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(automation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Automation
exports.deleteAutomation = async (req, res) => {
  try {
    const automation = await Automation.findById(req.params.id);

    if (!automation) {
      return res.status(404).json({ message: 'Automation not found' });
    }

    // Check Org access
    if (automation.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await automation.deleteOne();
    res.json({ message: 'Automation removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
