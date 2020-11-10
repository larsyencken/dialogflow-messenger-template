import Router from 'koa-router';
import { Context, Next } from 'koa';

import config from './config';
import { handlePage } from './facebook';
import { FBPage } from './types';

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
 * Handle a set of events sent to us from Facebook. The most important event
 * type is messages from the user to us.
 */
const facebookEvent = async (ctx: Context, next: Next) => {
  const page: FBPage = ctx.request.body;
  if (page) {
    // process and respond in the background (don't await)
    handlePage(page);
  }
  // respond immediately to Facebook
  ctx.status = 200;
  await next();
};

router.get('/healthcheck', healthcheck);
router.get('/facebook', facebookValidate);
router.post('/facebook', facebookEvent);

export default router;
