/**
 * Default Totemish routing handlers.
 */
import { ContextType } from './type/context.type';

export namespace DefaultHandlers {
  /**
   * Default error handler. Prints contents of the error on the page.
   * @todo Add JSON output.
   * @param {Error} error
   * @returns {(ctx: ContextType) => void}
   * @constructor
   */
  export const ErrorHandler = (error?: Error) => (ctx: ContextType) => {
    ctx.res.statusCode = 500;
    ctx.res.end(`<h1>${error.name}</h1><p>${error.message}</p><pre>${error.stack}</pre>`);
  };

  /**
   * Default 404 handler.
   * @param {ContextType} ctx
   * @constructor
   */
  export const NotFoundHandler = (ctx: ContextType) => {
    if (ctx.req.method === 'OPTIONS') {
      ctx.req.statusCode = 200;
      ctx.res.end();

      return;
    }

    ctx.res.statusCode = 404;
    ctx.res.write(`<h1>404 Not Found</h1>`);
    ctx.res.write(`<strong>${ctx.req.method}</strong>`);
    ctx.res.end(` ${ctx.req.url}`);
  };
}
