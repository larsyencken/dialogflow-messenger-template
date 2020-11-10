import request from 'supertest';

import server from '../../src';

// close the server after each test
afterEach(done => {
  server.close();
  done();
});

describe('routes/healthcheck', () => {
  it('should return 200', async () => {
    const response = await request(server)
      .get('/healthcheck')
      .send();
    expect(response.status).toEqual(200);
  });
});
