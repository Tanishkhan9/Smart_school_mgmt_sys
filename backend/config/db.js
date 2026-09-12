const mongoose = require('mongoose');
const { seed } = require('../seed/seedDatabase');

let mongoMemoryServer = null;

const startInMemoryMongo = async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoMemoryServer = await MongoMemoryServer.create();
  const uri = mongoMemoryServer.getUri();
  console.log('⚡ Starting embedded in-memory MongoDB instance...');
  const conn = await mongoose.connect(uri);
  console.log(`✅ In-memory MongoDB connected: ${conn.connection.host}`);
  console.log('🌱 Populating demo data (seed)...');
  await seed();
  return conn;
};

const connectDB = async () => {
  if (process.env.USE_IN_MEMORY_DB === 'true') {
    return startInMemoryMongo();
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log('ℹ️ No MONGO_URI provided. Using automated in-memory MongoDB.');
    return startInMemoryMongo();
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    
    // If connected to a new/empty database, populate demo accounts
    try {
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('🌱 Database is empty. Populating demo accounts...');
        await seed();
      }
    } catch (seedErr) {
      console.warn('⚠️ Auto-seed check skipped:', seedErr.message);
    }

    return conn;
  } catch (err) {
    const isLocalhost = uri.includes('127.0.0.1') || uri.includes('localhost');
    if (isLocalhost) {
      console.warn(`⚠️ Could not connect to local MongoDB at ${uri} (${err.message}).`);
      console.log('⚡ Falling back to automated in-memory MongoDB for seamless development...');
      return startInMemoryMongo();
    }
    throw err;
  }
};

module.exports = connectDB;
