require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DATABASE = process.env.MONGO_DB_NAME?.replace(/'^|\'$/g, '') || process.env.MONGO_DATABASE || 'datafeeder';

async function initializeDatabase() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db(MONGO_DATABASE);

  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
    if (!existingAdmin) {
      const { hashPassword } = require('./utils/auth');
      const passwordHash = await hashPassword(adminPassword);
      const adminUser = {
        email: adminEmail,
        password_hash: passwordHash,
        role: 'Admin',
        is_active: true,
        created_at: new Date(),
        failed_attempts: 0
      };
      await db.collection('users').insertOne(adminUser);
      console.log(`Admin user created: ${adminEmail}`);
    }
  }

  return db;
}

initializeDatabase().then(db => {
  const app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  app.use('/api/auth', authRoutes);
  app.use('/api', protectedRoutes);
  const dataRoutes = require('./routes/data');
  app.use('/api', dataRoutes);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
