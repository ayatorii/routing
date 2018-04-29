import { Right } from '@totemish/core';
import { RouteType } from '../type/route.type';

export const normalizeRoute = (route: RouteType): string =>
  Right.of(route)
    .map((r: string | RegExp): string => typeof r === 'string' ? r: r.source)
    .map((r: string): string => r.charAt(r.length - 1) !== '$' ? r : r.replace(/\$$/, ''))
    .map((r: string): string => r.charAt(0) !== '^' ? r : r.replace(/^\^/, ''))
    .fold(() => {}, (r: string) => r)
;

export const normalizeTrailingSlashes = (route: RouteType): string =>
  Right.of(route)
    .map((r: string | RegExp): string => typeof r === 'string' ? r: r.source)
    .fold(() => {}, (r: string) =>
      r.charAt(r.length - 1) !== '?'
        ? (r.charAt(r.length - 1) !== '/' ? `${r}\/?` : `${r}?`)
        : r
    )
;
