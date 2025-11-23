const { v4: uuidv4 } = require('uuid');
const Otp = require('../models/Otp');
const User = require('../models/User');
const { hashOtp, compareOtp, signToken } = require('../utils/hash');

const OTP_TTL_SECONDS = parseInt(process.env.OTP_TTL_SECONDS || '300', 10);

async function sendOtp(req, res) {
  try {
    const { phone, countryCode } = req.body;
    if (!phone || !countryCode) return res.status(400).json({ success: false, message: 'phone and countryCode required' });

    const requestId = uuidv4();
    const otp = (process.env.NODE_ENV === 'test' && process.env.TEST_OTP) ? process.env.TEST_OTP : String(Math.floor(1000 + Math.random() * 9000));
    const codeHash = await hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

    await Otp.create({ requestId, phone, codeHash, expiresAt });

    // Mock sending SMS in local/dev: log OTP
    console.log(`OTP for ${phone}: ${otp}`);

    return res.json({ success: true, verificationSent: true, requestId, expiresAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed sending OTP' });
  }
}

async function verifyOtp(req, res) {
  try {
    const { phone, otp, requestId } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: 'phone and otp required' });

    let otpDoc = null;
    if (requestId) {
      otpDoc = await Otp.findOne({ requestId, phone });
    } else {
      otpDoc = await Otp.findOne({ phone, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });
    }

    if (!otpDoc) return res.status(400).json({ success: false, message: 'No OTP found or expired' });

    const ok = await compareOtp(String(otp), otpDoc.codeHash);
    if (!ok) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    // Upsert user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone, countryCode: req.body.countryCode || '' });
    }

    // Issue JWT
    const token = signToken({ userId: user._id.toString() });
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    // Remove OTP after successful verification
    await Otp.deleteOne({ _id: otpDoc._id });

    return res.json({ success: true, token, userId: user._id.toString(), expiresAt: tokenExpiresAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
}

module.exports = { sendOtp, verifyOtp };
