import { Either } from '@totemish/core';
import { PathType } from '../type/path.type';

/**
 * Normalize string route by making it trailing-slash-friendly.
 * @function normalizeTrailingSlashes
 * @param {PathType} route
 * @returns {string}
 */
export const normalizeTrailingSlashes = (route: PathType): string =>
  Either.fromNullable(<any> route)
  // .map((r) => Any.of(r instanceof RegExp).concat(Any.of(typeof r !== 'string')).isTrue ? r : this.swap())
    .map((r) => typeof r === 'string' ? r : r.source)
    .map((r) => r.charAt(r.length - 1) !== '?' ? (r.charAt(r.length - 1) !== '/' ? `${r}/?` : `${r}?`) : r)
    .fold((r) => r, (r) => r)
;
