/**
 * A generic chatbot handler built off of middleware layers.
 */

// The context describes how we are responding to chat right now
export interface Context {
  user: string;
  message: string;
  response?: string;
  intent?: string;
}

export type MiddlewareNext = () => Promise<Context>;

/**
 * A chat middleware. You may handle the response yourself, mutate or change it,
 * or call next() to allow another layer to process it. You return the response.
 */
export type Middleware = (ctx: Context, next: MiddlewareNext) => Promise<void>;

export class ChatBot {
  _middlewares: Array<Middleware> = [];

  /**
   * Add this middleware to the response stack.
   */
  use(middleware: Middleware) {
    this._middlewares.push(middleware);
  }

  /**
   * Handle an incoming message using the middlewares configured.
   */
  async handle(ctx: Context): Promise<Context> {
    if (!this._middlewares.length) {
      this._unhandled(ctx);
    }
    await this._middlewares[0](ctx, this._next(0, ctx));
    return ctx;
  }

  _next(ix: number, ctx: Context): MiddlewareNext {
    if (ix + 1 < this._middlewares.length) {
      // trampoline to the next handler
      return async (): Promise<Context> => {
        await this._middlewares[ix + 1](ctx, this._next(ix + 1, ctx));
        return ctx;
      };
    }

    return async (): Promise<Context> => {
      this._unhandled(ctx);
      return ctx; // never reached
    };
  }

  _unhandled(ctx: Context): void {
    throw Error(`unhandled message: "${ctx.message}"`);
  }
}
