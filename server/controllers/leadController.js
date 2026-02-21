const Lead = require("../models/Lead");
const { evaluateAndExecute } = require("../services/automationExecutionService");
const { createLog } = require('../services/auditService');

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      assignedTo,
      notes,
      tags,
    } = req.body;

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
      tags,
    });

    const lead = await newLead.save();

    // Trigger Automations (awaiting to ensure fields update before returning)
    await evaluateAndExecute(req.user.organization, 'Lead', 'Created', lead);

    // Write Audit Log
    await createLog(req, 'Lead', lead._id, 'CREATE', { name: lead.name, status: lead.status });

    // Re-fetch the lead in case automations updated its fields
    const updatedLead = await Lead.findById(lead._id).populate("assignedTo", "name email");

    res.status(201).json(updatedLead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get All Leads (Org Scoped) with Filtering, Sorting & Pagination
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, source, sort } = req.query;

    const query = { organization: req.user.organization };

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (status) query.status = status;
    if (source) query.source = source;

    // Sort
    let sortOptions = { createdAt: -1 }; // Default
    if (sort) {
      const [field, order] = sort.split(":");
      sortOptions = { [field]: order === "desc" ? -1 : 1 };
    }

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get Single Lead
exports.getLead = async (req, res) => {
  try {
    const lead = req.resource; // From middleware
    await lead.populate("assignedTo", "name email");
    res.json(lead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    let lead = req.resource; // From middleware

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    // Trigger Automations (awaiting to ensure fields update before returning)
    await evaluateAndExecute(req.user.organization, 'Lead', 'Updated', lead);

    // Write Audit Log (we only have the new req.body here easily, but we can log that)
    await createLog(req, 'Lead', lead._id, 'UPDATE', req.body);

    // Re-fetch the lead in case automations updated its fields
    const updatedLead = await Lead.findById(lead._id).populate("assignedTo", "name email");

    res.json(updatedLead);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = req.resource; // From middleware
    await lead.deleteOne();
    
    // Write Audit Log
    await createLog(req, 'Lead', req.params.id, 'DELETE', { name: lead.name });
    
    res.json({ message: 'Lead removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Bulk Delete Leads
exports.deleteLeads = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: 'No lead IDs provided' });
    }

    await Lead.deleteMany({ 
      _id: { $in: ids },
      organization: req.user.organization 
    });

    res.json({ message: 'Leads removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Export Leads to CSV
const { Parser } = require('json2csv');

exports.exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ organization: req.user.organization }).populate('assignedTo', 'name email');
    
    const fields = ['name', 'email', 'phone', 'company', 'status', 'source', 'tags', 'assignedTo.name', 'createdAt'];
    const opts = { fields };
    
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(leads);
      
      res.header('Content-Type', 'text/csv');
      res.attachment('leads.csv');
      return res.send(csv);
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error generating CSV');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Import Leads from CSV
const csv = require('csv-parser');
const fs = require('fs');

exports.importLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
            // Transform data if necessary and add organization
            const leadsToCreate = results.map(item => ({
                ...item,
                organization: req.user.organization,
                // Handle tags if they are comma separated string in CSV
                tags: item.tags ? item.tags.split(',').map(tag => tag.trim()) : []
            }));

            if (leadsToCreate.length > 0) {
                await Lead.insertMany(leadsToCreate);
            }
            
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            
            res.json({ message: `${leadsToCreate.length} leads imported successfully` });
        } catch (error) {
             console.error('Error importing leads:', error);
             res.status(500).send('Error importing leads');
        }
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
