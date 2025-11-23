const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  phone: { type: String, required: true, index: true },
  countryCode: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  vendorProfileId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
