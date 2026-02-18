const Ticket = require('../models/Ticket');

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, description, status, priority, category, customer, assignedTo } = req.body;

    const newTicket = new Ticket({
      subject,
      description,
      status,
      priority,
      category,
      customer,
      assignedTo,
      organization: req.user.organization // Enforce Org Isolation
    });

    const ticket = await newTicket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Tickets (Org Scoped)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ organization: req.user.organization })
      .populate('assignedTo', 'name email')
      .populate('customer', 'name email company')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Single Ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('customer', 'name email company');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check Org access
    if (ticket.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update Ticket
exports.updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check Org access
    if (ticket.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check Org access
    if (ticket.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
