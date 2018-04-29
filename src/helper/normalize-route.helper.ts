import { Either } from '@totemish/core';
import { PathType } from '../type/path.type';

/**
 * Normalize route by removing $ and ^.
 * @function normalizeRoute
 * @param {PathType} route
 * @returns {string}
 */
export const normalizeRoute = (route: PathType): string =>
  Either.fromNullable(<any> route)
  // .map((r) => Any.of(r instanceof RegExp).concat(Any.of(typeof r !== 'string')).isTrue ? r : this.swap())
    .map((r) => typeof r === 'string' ? r : r.source)
    .map((r) => r.charAt(r.length - 1) !== '$' ? r : r.replace(/\$$/, ''))
    .map((r) => r.charAt(0) !== '^' ? r : r.replace(/^\^/, ''))
    .fold((r) => r, (r) => r)
;
