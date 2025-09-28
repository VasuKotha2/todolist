const request = require('supertest');
const createApp = require('../src/index');
const memoryDb = require('../src/db/memory');

beforeEach(() => {
  memoryDb.reset();
});

describe('Todos API', () => {
  const app = createApp({ db: memoryDb });

  test('health check returns status and commit', async () => {
    process.env.COMMIT_SHA = 'abc123';
    const res = await request(app).get('/healthz').expect(200);
    expect(res.body).toEqual({ status: 'ok', commit: 'abc123' });
  });

  test('happy path create and list', async () => {
    const createRes = await request(app)
      .post('/api/v1/todos')
      .send({ title: 'first' })
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(createRes.body).toMatchObject({ title: 'first', done: false });
    expect(createRes.body.id).toBeTruthy();

    const listRes = await request(app).get('/api/v1/todos').expect(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].title).toBe('first');
  });

  test('validation: missing title -> 400', async () => {
    await request(app)
      .post('/api/v1/todos')
      .send({ title: '' })
      .set('Content-Type', 'application/json')
      .expect(400);
  });
});
