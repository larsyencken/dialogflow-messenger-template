import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';

import router from './routes';

const app = new Koa();

// set up middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(3000, () => {
  console.log('Listening on http://localhost:3000/');
});

export default server;
