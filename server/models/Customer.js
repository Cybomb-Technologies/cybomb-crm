const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // unique per org? usually.
  phone: { type: String },
  company: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  // We can link to Deals, Tickets via those models having customerId, or array here.
  // Keeping it simple: separate models reference Customer.
}, { timestamps: true });

customerSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Customer', customerSchema);
