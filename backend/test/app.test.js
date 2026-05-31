import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

describe('items api', () => {
  it('lists initial items', async () => {
    const response = await request(app).get('/items');

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 2);
  });

  it('creates an item', async () => {
    const response = await request(app)
      .post('/items')
      .send({ name: 'Mouse', description: 'Mouse sem fio' });

    assert.equal(response.status, 201);
    assert.equal(response.body.name, 'Mouse');
  });

  it('validates required fields', async () => {
    const response = await request(app).post('/items').send({ name: '' });

    assert.equal(response.status, 400);
  });
});
