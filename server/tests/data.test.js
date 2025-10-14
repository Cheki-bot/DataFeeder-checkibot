const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
let app, db, mongoServer, client;

function createApp(dbInstance) {
  const express = require('express');
  const authRoutes = require('../routes/auth');
  const protectedRoutes = require('../routes/protected');
  const dataRoutes = require('../routes/data');
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => { req.db = dbInstance; next(); });
  app.use('/api/auth', authRoutes);
  app.use('/api', protectedRoutes);
  app.use('/api', dataRoutes);
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
  await db.collection('data').deleteMany({});
});

test('user can upload JSON', async () => {
  await request(app).post('/api/auth/register').send({ email: 'user@example.com', password: 'password123', role: 'User' });
  const loginRes = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'password123' });
  expect(loginRes.status).toBe(200);
  const token = loginRes.body.access_token;

  const uploadRes = await request(app)
    .post('/api/data')
    .set('Authorization', `Bearer ${token}`)
    .send({ foo: 'bar' });

  expect(uploadRes.status).toBe(201);
  expect(uploadRes.body).toHaveProperty('id');

  const stored = await db.collection('data').findOne({});
  expect(stored.payload).toEqual({ foo: 'bar' });
});
