const AutomationRule = require('../models/AutomationRule');

// @desc    Get all automation rules for an organization
// @route   GET /api/automations
// @access  Private (org_admin)
exports.getRules = async (req, res) => {
  try {
    const rules = await AutomationRule.find({ organization: req.user.organization })
      .populate('createdBy', 'name email');
    res.json(rules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single automation rule
// @route   GET /api/automations/:id
// @access  Private (org_admin)
exports.getRuleById = async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ 
        _id: req.params.id, 
        organization: req.user.organization 
    }).populate('createdBy', 'name email');
    
    if (!rule) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    res.json(rule);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Create automation rule
// @route   POST /api/automations
// @access  Private (org_admin)
exports.createRule = async (req, res) => {
  try {
    const { name, description, isActive, trigger, conditions, actions } = req.body;

    // Check if rule name already exists for this org
    let existingRule = await AutomationRule.findOne({ 
        name, 
        organization: req.user.organization 
    });
    if (existingRule) {
      return res.status(400).json({ message: 'An automation rule with this name already exists' });
    }

    const newRule = new AutomationRule({
      organization: req.user.organization,
      name,
      description,
      isActive,
      trigger,
      conditions,
      actions,
      createdBy: req.user.id
    });

    const rule = await newRule.save();
    res.status(201).json(rule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update automation rule
// @route   PUT /api/automations/:id
// @access  Private (org_admin)
exports.updateRule = async (req, res) => {
  try {
    const { name, description, isActive, trigger, conditions, actions } = req.body;

    let rule = await AutomationRule.findOne({ 
        _id: req.params.id, 
        organization: req.user.organization 
    });

    if (!rule) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }

    // Check name collision
    if (name && name !== rule.name) {
       let duplicateRule = await AutomationRule.findOne({ 
          name, 
          organization: req.user.organization,
          _id: { $ne: req.params.id }
       });
       if (duplicateRule) {
           return res.status(400).json({ message: 'An automation rule with this name already exists' });
       }
    }

    rule.name = name || rule.name;
    rule.description = description !== undefined ? description : rule.description;
    rule.isActive = isActive !== undefined ? isActive : rule.isActive;
    rule.trigger = trigger || rule.trigger;
    rule.conditions = conditions || rule.conditions;
    rule.actions = actions || rule.actions;

    await rule.save();
    res.json(rule);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Delete automation rule
// @route   DELETE /api/automations/:id
// @access  Private (org_admin)
exports.deleteRule = async (req, res) => {
  try {
    const rule = await AutomationRule.findOne({ 
        _id: req.params.id, 
        organization: req.user.organization 
    });

    if (!rule) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }

    await rule.deleteOne();
    res.json({ message: 'Automation rule removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    res.status(500).send('Server error');
  }
};
