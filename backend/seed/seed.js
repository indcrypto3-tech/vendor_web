const db = require('../config/db');
const User = require('../models/User');

async function run() {
  await db.connect();
  const u = await User.create({ phone: '5550000000', countryCode: '+1', name: 'Seed User' });
  console.log('seeded user', u._id.toString());
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
