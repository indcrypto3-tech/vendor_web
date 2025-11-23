process.env.NODE_ENV = 'test';
process.env.TEST_OTP = '1234';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  // require app after connecting or simply require (app doesn't auto connect)
  app = require('../index');
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

test('send-otp then verify-otp and use token to create vendor', async () => {
  const phone = '5551234567';
  const countryCode = '+1';

  const sendRes = await request(app).post('/auth/send-otp').send({ phone, countryCode });
  expect(sendRes.status).toBe(200);
  expect(sendRes.body.success).toBe(true);
  expect(sendRes.body.requestId).toBeDefined();
  const requestId = sendRes.body.requestId;

  const verifyRes = await request(app).post('/auth/verify-otp').send({ phone, otp: '1234', requestId, countryCode });
  expect(verifyRes.status).toBe(200);
  expect(verifyRes.body.success).toBe(true);
  expect(verifyRes.body.token).toBeDefined();
  expect(verifyRes.body.userId).toBeDefined();

  const token = verifyRes.body.token;

  // create vendor
  const vendorPayload = { businessName: 'Test Biz', businessAddress: '123 Test St', categories: ['cleaning'], services: [{ name: 'Wash', price: '25.00' }] };
  const createRes = await request(app).post('/vendors').set('Authorization', `Bearer ${token}`).send(vendorPayload);
  expect(createRes.status).toBe(201);
  expect(createRes.body.success).toBe(true);
  expect(createRes.body.vendor).toBeDefined();
  expect(createRes.body.vendor.businessName).toBe('Test Biz');
});
