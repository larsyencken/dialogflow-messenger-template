/**
 * Chat middleware and routing, inspired by Koa.
 */

import { Context, MiddlewareNext, ChatBot } from './bot';
import { dialogflow } from './dialogflow';
import { respondViaMessenger } from './facebook';

/**
 * Log responses to the console.
 */
async function consoleLogger(
  ctx: Context,
  next: MiddlewareNext
): Promise<void> {
  console.log(`--> ${ctx.message}`);
  await next();
  if (ctx.response) {
    console.log(`<-- ${ctx.response}`);
  }
}

export const chatBot = new ChatBot();

chatBot.use(consoleLogger);
chatBot.use(respondViaMessenger);
chatBot.use(dialogflow);
