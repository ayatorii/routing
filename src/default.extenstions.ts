import { parse } from 'querystring';
import * as url from 'url';
import { Either } from '@totemish/core';
import { readFileSync } from 'fs';
import { ContextType } from './type/context.type';

/**
 * Default extensions for Node.js HTTP request and response.
 * @type {((ctx) => ctx)[]}
 */
export const DefaultExtensions = [
  /**
   * Add query parameters to the request object.
   * @param {ContextType} ctx
   * @returns {ContextType}
   */
  (ctx: ContextType) => {
    ctx.req.qp = parse(url.parse(ctx.req.url).query);
    return ctx;
  },

  /**
   * Add Response#redirect method.
   * @param {ContextType} ctx
   * @returns {ContextType}
   */
  (ctx: ContextType) => {
    ctx.res.redirect = (to: string, status: number = 302) => {
      ctx.res.writeHead(status, { 'Location': to });
      ctx.res.end();
    };

    return ctx;
  },

  /**
   * Add Response#render method that sends contents of given file.
   * @param {ContextType} ctx
   * @returns {ContextType}
   */
  (ctx: ContextType) => {
    ctx.res.render = (path: string) =>
      ctx.res.end(Either.try(() => readFileSync(path))
        .fold(() => '', (contents) => contents),
      );

    return ctx;
  },
];
