const Deal = require('../models/Deal');

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
    res.status(201).json(deal);
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
    let deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (deal.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(deal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Deal
exports.deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (deal.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await deal.deleteOne();
    res.json({ message: 'Deal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
