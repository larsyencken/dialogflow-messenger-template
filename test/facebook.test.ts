import request from 'supertest';

import server from '../src';
import config from '../src/config';

// close the server after each test
afterEach((done) => {
  server.close();
  done();
});

describe('routes/facebookValidate', () => {
  it('should return 403 without query parameters', async () => {
    const response = await request(server).get('/facebook').send();
    expect(response.status).toEqual(403);
  });

  it('should return 200 and the challenge if the token is correct', async () => {
    const response = await request(server).get('/facebook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': config.FACEBOOK_WEBHOOK_SECRET,
      'hub.challenge': 'something',
    });

    expect(response.status).toEqual(200);
    expect(response.text).toEqual('something');
  });

  it('should return 403 if the token is correct', async () => {
    const response = await request(server).get('/facebook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'justwrong',
      'hub.challenge': 'something',
    });

    expect(response.status).toEqual(403);
  });
});

describe('routes/facebookEvent', () => {
  it('responds to an empty POST with 200', async () => {
    const response = await request(server).post('/facebook').send();

    expect(response.status).toEqual(200);
  });
  it('responds to POST with 200', async () => {
    const response = await request(server)
      .post('/facebook')
      .send({ entry: [] });

    expect(response.status).toEqual(200);
  });
});
