const Deal = require('../models/Deal');
const { evaluateAndExecute } = require('../services/automationExecutionService');
const { createLog } = require('../services/auditService');

// Create Deal
exports.createDeal = async (req, res) => {
  try {
    const { title, value, currency, stage, probability, expectedCloseDate, contactPerson, assignedTo, notes } = req.body;

    const newDeal = new Deal({
      title,
      value,
      currency,
      stage,
      probability,
      expectedCloseDate,
      contactPerson,
      assignedTo: assignedTo || req.user.id,
      organization: req.user.organization,
      notes
    });

    const deal = await newDeal.save();

    // Trigger Automations (awaiting to ensure fields update before returning)
    await evaluateAndExecute(req.user.organization, 'Deal', 'Created', deal);
    
    // Write Audit Log
    await createLog(req, 'Deal', deal._id, 'CREATE', { title: deal.title, value: deal.value, stage: deal.stage });

    const updatedDeal = await Deal.findById(deal._id)
      .populate('assignedTo', 'name email')
      .populate('contactPerson', 'name company');

    res.status(201).json(updatedDeal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Deals (Org Scoped)
exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ organization: req.user.organization })
      .populate('assignedTo', 'name email')
      .populate('contactPerson', 'name company')
      .sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Deal (e.g., Stage Change)
exports.updateDeal = async (req, res) => {
  try {
    let deal = req.resource; // From middleware

    deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Trigger Automations (awaiting to ensure fields update before returning)
    await evaluateAndExecute(req.user.organization, 'Deal', 'Updated', deal);

    // Write Audit Log
    await createLog(req, 'Deal', deal._id, 'UPDATE', req.body);

    const updatedDeal = await Deal.findById(deal._id)
      .populate('assignedTo', 'name email')
      .populate('contactPerson', 'name company');

    res.json(updatedDeal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Deal
exports.deleteDeal = async (req, res) => {
  try {
    const deal = req.resource; // From middleware
    await deal.deleteOne();
    
    // Write Audit Log
    await createLog(req, 'Deal', req.params.id, 'DELETE', { title: deal.title });
    
    res.json({ message: 'Deal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
