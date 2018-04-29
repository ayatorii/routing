import { Router } from './router';
import { ContextType } from './type/context.type';


/**
 * Default Totemish routing middleware.
 */
export namespace DefaultMiddleware {
  /**
   * Add 'Access-Control-Allow-Methods' header with all methods available for current route.
   * @param {Router} router
   * @returns {(ctx: ContextType) => ContextType}
   * @constructor
   */
  export const AllowMethods = (router: Router) => (ctx: ContextType) => {
    ctx.res.setHeader('Access-Control-Allow-Methods', router.getMethods(ctx.req.pathname).join(', '));

    return ctx;
  };
}
