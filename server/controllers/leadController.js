const Lead = require('../models/Lead');

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, status, assignedTo, notes, tags } = req.body;

    const newLead = new Lead({
      name,
      email,
      phone,
      company,
      source,
      status,
      assignedTo: assignedTo || req.user.id, // Default to creator if not assigned
      organization: req.user.organization, // Enforce Org Isolation
      notes,
      tags
    });

    const lead = await newLead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Leads (Org Scoped)
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ organization: req.user.organization })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Single Lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check Org access
    if (lead.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check Org access
    if (lead.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check Org access
    if (lead.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
