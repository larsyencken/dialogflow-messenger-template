import Router from 'koa-router';
import { Context, Next } from 'koa';

import config from './config';
import { handlePage, FBPage } from './facebook';

const router = new Router();

/**
 * Check the server is working.
 */
const healthcheck = async (ctx: Context, next: Next) => {
  ctx.status = 200;
  ctx.body = 'OK';
  await next();
};

/**
 * Validation handshake with Facebook to register this webhook.
 */
const facebookValidate = async (ctx: Context, next: Next) => {
  const query = ctx.request.query;

  const mode = query['hub.mode'];
  const token = query['hub.verify_token'];
  const challenge = query['hub.challenge'];

  if (
    mode === 'subscribe' &&
    token === config.FACEBOOK_WEBHOOK_SECRET &&
    challenge
  ) {
    ctx.status = 200;
    ctx.body = challenge;
  } else {
    ctx.status = 403;
  }
  await next();
};

/**
 * Receive a Facebook event.
 */
const facebookEvent = async (ctx: Context, next: Next) => {
  const event: FBPage = ctx.request.body;
  if (event) {
    handlePage(event);
  }
  ctx.status = 200;
  await next();
};

router.get('/healthcheck', healthcheck);
router.get('/facebook', facebookValidate);
router.post('/facebook', facebookEvent);

export default router;
