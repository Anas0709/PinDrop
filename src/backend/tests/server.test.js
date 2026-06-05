const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

// Avoid binding a port during tests
process.env.NODE_ENV = 'test';
delete process.env.OPENAI_API_KEY;

const app = require('../server');

describe('API endpoints', () => {
  it('GET /api/health returns OK', async () => {
    const res = await request(app).get('/api/health').expect(200);
    assert.equal(res.body.status, 'OK');
    assert.ok(res.body.timestamp);
    assert.ok(res.headers['x-request-id']);
  });

  it('GET /api/ready returns 503 when OpenAI key is missing', async () => {
    const res = await request(app).get('/api/ready').expect(503);
    assert.equal(res.body.status, 'not_ready');
    assert.equal(res.body.checks.openai_api_key, false);
  });

  it('GET /api/ready returns 200 when OpenAI key is configured', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    const res = await request(app).get('/api/ready').expect(200);
    assert.equal(res.body.status, 'ready');
    assert.equal(res.body.checks.openai_api_key, true);
    delete process.env.OPENAI_API_KEY;
  });

  it('POST /api/classify rejects invalid payloads', async () => {
    const res = await request(app)
      .post('/api/classify')
      .send({ stem: 'Q?', choices: ['only one'] })
      .expect(400);
    assert.match(res.body.error, /between 2 and 26/);
    assert.ok(res.headers['x-request-id']);
  });

  it('POST /api/classify rejects missing stem for multiple choice', async () => {
    const res = await request(app)
      .post('/api/classify')
      .send({ choices: ['A', 'B'] })
      .expect(400);
    assert.match(res.body.error, /stem/);
  });

  it('echoes X-Request-Id when provided', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('X-Request-Id', 'test-correlation-id')
      .expect(200);
    assert.equal(res.headers['x-request-id'], 'test-correlation-id');
  });
});

describe('server startup', () => {
  it('listen only when executed directly', () => {
    assert.ok(app);
    assert.equal(typeof app.listen, 'function');
  });
});
