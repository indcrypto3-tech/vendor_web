const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Schema.Types.Decimal128 }
});

const VendorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessAddress: { type: String },
  categories: [{ type: String }],
  services: [ServiceSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);
