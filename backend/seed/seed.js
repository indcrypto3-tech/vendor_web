const db = require('../config/db');
const User = require('../models/User');

async function run() {
  await db.connect();
  // Upsert seed user to make the script idempotent during repeated builds
  const phone = '5550000000';
  const update = { countryCode: '+1', name: 'Seed User' };
  const res = await User.findOneAndUpdate({ phone }, { $setOnInsert: update }, { upsert: true, new: true });
  console.log('seeded/upserted user', res._id.toString());
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
