const Customer = require('../models/Customer');
const { createLog } = require('../services/auditService');

// Create Customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, address } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      phone,
      company,
      address,
      organization: req.user.organization // Enforce Org Isolation
    });

    const customer = await newCustomer.save();
    
    // Write Audit Log
    await createLog(req, 'Customer', customer._id, 'CREATE', { name: customer.name, company: customer.company });
    
    res.status(201).json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get All Customers (Org Scoped)
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ organization: req.user.organization })
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Single Customer
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check Org access
    if (customer.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check Org access
    if (customer.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Write Audit Log
    await createLog(req, 'Customer', customer._id, 'UPDATE', req.body);

    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check Org access
    if (customer.organization.toString() !== req.user.organization) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await customer.deleteOne();
    
    // Write Audit Log
    await createLog(req, 'Customer', req.params.id, 'DELETE', { name: customer.name });
    
    res.json({ message: 'Customer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
