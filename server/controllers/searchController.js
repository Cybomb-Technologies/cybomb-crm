const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');

exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ leads: [], deals: [], customers: [], tickets: [] });
    }

    const searchQuery = { $regex: q, $options: 'i' };
    const orgQuery = { organization: req.user.organization };

    // Run searches in parallel for maximum performance
    const [leads, deals, customers, tickets] = await Promise.all([
      // Search Leads by name, email, or company
      Lead.find({
        ...orgQuery,
        $or: [{ name: searchQuery }, { email: searchQuery }, { company: searchQuery }]
      })
      .select('name email company')
      .limit(5),

      // Search Deals by name
      Deal.find({
        ...orgQuery,
        name: searchQuery
      })
      .select('name stage value')
      .limit(5),

      // Search Customers by name, email, or company
      Customer.find({
        ...orgQuery,
        $or: [{ name: searchQuery }, { email: searchQuery }, { company: searchQuery }]
      })
      .select('name email company status')
      .limit(5),

      // Search Support Tickets by title
      Ticket.find({
        ...orgQuery,
        title: searchQuery
      })
      .select('title status priority')
      .limit(5)
    ]);

    // Return aggregated results
    res.json({
      leads,
      deals,
      customers,
      tickets
    });

  } catch (err) {
    console.error('Global Search Error:', err);
    res.status(500).send('Server Error');
  }
};
