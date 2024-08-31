import { Test, TestingModule } from '@nestjs/testing';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
import { INestApplication } from '@nestjs/common';
// import { Response } from 'supertest';
import { InvoicesModule } from './invoices.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';

describe('InvoicesController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [MongooseModule.forRoot(uri), InvoicesModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    } catch (err) {
      console.error('Failed to start MongoMemoryServer:', err);
    }
  });

  afterAll(async () => {
    try {
      if (app) {
        await app.close();
      }
      if (mongod) {
        await mongod.stop();
      }
    } catch (err) {
      console.error('Failed to close MongoMemoryServer:', err);
    }
  });

  it('/invoices (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/invoices')
      .send({
        customer: 'John Doe',
        amount: 100.0,
        reference: 'INV-001',
        date: new Date(),
        items: [
          { sku: 'ITEM-1', qt: 1 },
          { sku: 'ITEM-2', qt: 2 },
        ],
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.customer).toBe('John Doe');
  });

  it('/invoices (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/invoices')
      .query({
        startDate: '2023-05-01T00:00:00.000Z',
        endDate: '2023-05-31T23:59:59.999Z',
        customer: 'John Doe',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('/invoices/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/invoices')
      .send({
        customer: 'Jane Doe',
        amount: 200.0,
        reference: 'INV-002',
        date: new Date(),
        items: [{ sku: 'ITEM-3', qt: 3 }],
      });

    const invoiceId = createResponse.body.data._id;

    const response = await request(app.getHttpServer())
      .get(`/invoices/${invoiceId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(invoiceId);
    expect(response.body.data.customer).toBe('Jane Doe');
  });

  it('/invoices/:id (GET) with invalid ID', async () => {
    const invalidId = 'invalid-id';
    const response = await request(app.getHttpServer())
      .get(`/invoices/${invalidId}`)
      .expect(400);

    expect(response.body.message).toBe('Invalid invoice ID');
  });
});

// increased for mongodb-memory-server initial download
jest.setTimeout(10000);
