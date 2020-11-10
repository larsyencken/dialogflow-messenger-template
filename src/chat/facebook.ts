import { Context, MiddlewareNext } from './bot';
import { messenger } from '../messenger';

/**
 * Send responses to Facebook.
 */
export async function respondViaMessenger(
  ctx: Context,
  next: MiddlewareNext
): Promise<void> {
  await next();
  if (ctx.response) {
    await messenger.markSeen(ctx.user);
    await sleep(1000);
    await messenger.startTyping(ctx.user);
    await sleep(1000);
    await messenger.sendMessage(ctx.user, ctx.response.text);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
