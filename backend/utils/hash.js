const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

async function hashOtp(otp) {
  return await bcrypt.hash(otp, SALT_ROUNDS);
}

async function compareOtp(otp, hash) {
  return await bcrypt.compare(otp, hash);
}

function signToken(payload, expiresIn = '7d') {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.verify(token, secret);
}

module.exports = { hashOtp, compareOtp, signToken, verifyToken };
