const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');
const { createLog } = require('../services/auditService');

// Helper to get correct model
const getModel = (entityType) => {
  switch (entityType) {
    case 'Lead': return Lead;
    case 'Deal': return Deal;
    case 'Customer': return Customer;
    case 'Ticket': return Ticket;
    default: return null;
  }
};

exports.getDeletedItems = async (req, res) => {
  try {
    const org = req.user.organization;
    
    // Fetch deleted items from all models
    const [deletedLeads, deletedDeals, deletedCustomers, deletedTickets] = await Promise.all([
      Lead.findDeleted({ organization: org }),
      Deal.findDeleted({ organization: org }),
      Customer.findDeleted({ organization: org }),
      Ticket.findDeleted({ organization: org })
    ]);

    // Format them uniformly for the frontend list
    const formatItem = (item, type) => ({
      _id: item._id,
      entityType: type,
      name: item.name || item.title || item.subject || 'Unknown',
      deletedAt: item.deletedAt,
      // Pass raw item if needed by frontend
      original: item
    });

    const combined = [
      ...deletedLeads.map(i => formatItem(i, 'Lead')),
      ...deletedDeals.map(i => formatItem(i, 'Deal')),
      ...deletedCustomers.map(i => formatItem(i, 'Customer')),
      ...deletedTickets.map(i => formatItem(i, 'Ticket'))
    ].sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt)); // Sort newest deleted first

    res.json(combined);
  } catch (err) {
    console.error('Error fetching recycle bin:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.restoreItem = async (req, res) => {
  try {
    const { id, entityType } = req.body;
    const Model = getModel(entityType);

    if (!Model) return res.status(400).json({ message: 'Invalid entity type' });

    const item = await Model.findOneDeleted({ _id: id, organization: req.user.organization });
    if (!item) return res.status(404).json({ message: 'Item not found in recycle bin' });

    await item.restore();
    
    // Audit Log for Restore
    await createLog(req, entityType, item._id, 'UPDATE', { _restored: true });

    res.json({ message: `${entityType} restored successfully` });
  } catch (err) {
    console.error('Error restoring item:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.permanentlyDeleteItem = async (req, res) => {
  try {
    const { id, entityType } = req.body;
    const Model = getModel(entityType);

    if (!Model) return res.status(400).json({ message: 'Invalid entity type' });

    // Ensure it belongs to the org before hard deleting
    const item = await Model.findOneDeleted({ _id: id, organization: req.user.organization });
    if (!item) return res.status(404).json({ message: 'Item not found in recycle bin' });

    // Actually delete it from the DB
    await Model.deleteOne({ _id: id });

    // Audit Log for Hard Delete
    await createLog(req, entityType, id, 'DELETE', { _hardDeleted: true, name: item.name || item.title || item.subject });

    res.json({ message: `${entityType} permanently deleted` });
  } catch (err) {
    console.error('Error permanently deleting item:', err.message);
    res.status(500).send('Server Error');
  }
};
