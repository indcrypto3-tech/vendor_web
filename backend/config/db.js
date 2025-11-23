const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vendorbackend';

let cached = global.__mongoClientPromise;

exports.connect = async function() {
  if (!MONGO_URI) throw new Error('MONGO_URI is not set');

  if (cached && cached.connection && cached.connection.readyState === 1) {
    return cached;
  }

  if (!global.__mongoClientPromise) {
    global.__mongoClientPromise = mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }).then((m) => {
      console.log('Connected to MongoDB');
      return m;
    });
  }

  cached = await global.__mongoClientPromise;
  return cached;
};
