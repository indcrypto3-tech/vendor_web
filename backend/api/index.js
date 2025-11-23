const serverless = require('serverless-http');
const db = require('../config/db');
const app = require('../index');

let handler = null;

async function ensureHandler() {
  if (handler) return handler;
  // ensure DB connection is established (cached)
  await db.connect();
  handler = serverless(app);
  return handler;
}

module.exports = async (req, res) => {
  const h = await ensureHandler();
  return h(req, res);
};
