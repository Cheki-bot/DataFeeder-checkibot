const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
let app, db, mongoServer, client;

function createApp(dbInstance) {
  const express = require('express');
  const authRoutes = require('../routes/auth');
  const protectedRoutes = require('../routes/protected');
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => { req.db = dbInstance; next(); });
  app.use('/api/auth', authRoutes);
  app.use('/api', protectedRoutes);
  return app;
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('test_db');
  app = createApp(db);
});

afterAll(async () => {
  if (client) await client.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await db.collection('users').deleteMany({});
});

test('register and login flow', async () => {
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', password: 'password123' });

  expect(registerRes.status).toBe(201);
  expect(registerRes.body.email).toBe('test@example.com');
  expect(registerRes.body).not.toHaveProperty('password_hash');

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body).toHaveProperty('access_token');
});
