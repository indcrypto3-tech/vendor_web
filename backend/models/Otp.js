const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
  requestId: { type: String, required: true, index: true },
  phone: { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true }
  , createdAt: { type: Date, default: Date.now }
});

// TTL index to let Mongo remove expired OTPs automatically
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', OtpSchema);
