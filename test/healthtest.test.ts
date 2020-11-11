import request from 'supertest';

import app from '../src/app';

describe('routes/healthcheck', () => {
  it('should return 200', async () => {
    const response = await request(app.callback()).get('/healthcheck').send();
    expect(response.status).toEqual(200);
  });
});
