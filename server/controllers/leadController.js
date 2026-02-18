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
    const lead = req.resource; // From middleware
    await lead.populate('assignedTo', 'name email');
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    let lead = req.resource; // From middleware

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
    const lead = req.resource; // From middleware
    await lead.deleteOne();
    res.json({ message: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
