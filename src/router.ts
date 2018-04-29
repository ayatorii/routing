import { HTTPMethodsType, HTTPMethodType, HTTPVerbsType } from './enum/http-method.enum';
import { ActionPipeline } from './pipeline';
import { ActionInterface } from './interface/action.interface';
import { Either, EitherType } from '@totemish/core';

export class RoutingContext {
  public static for = (prefix?: string) => new RoutingContext(prefix);

  private _routes: Map<string, Map<HTTPMethodType, ActionPipeline>> = new Map();
  private _prefix: string;

  public constructor(prefix: string = '') {
    this._prefix = prefix;
  }

  public find = (route: string, method: HTTPMethodType): ActionInterface[] => {
    return Either.fromNullable(this._routes.get(route))
      .chain((rc: Map<HTTPMethodType, ActionPipeline>) => Either.fromNullable(rc.get(method)))
      .fold(() => undefined, (p: ActionPipeline) => p.toPipeline());
  }

  public prefix = (prefix: string, of: (router: RoutingContext) => RoutingContext) => {
    console.log(of);
    this.concat(of(RoutingContext.for(this._prefix.concat(prefix))));
    return this;
  }

  public getMethods = (route: string) =>
    Array.from(this._routes.get(route).keys())

  private hasRoute = (path: string): boolean =>
    this._routes.has(this.pathWithPrefix(path))

  private hasMethod = (path: string, method: HTTPMethodType): boolean =>
    this._routes.get(this.pathWithPrefix(path)).has(method)

  private addRoute = (path: string, method: HTTPMethodType, action: ActionInterface): RoutingContext => {
    if (!this.hasRoute(path)) {
      this._routes.set(this.pathWithPrefix(path), new Map());
    }

    this._routes.get(this.pathWithPrefix(path)).set(method, ActionPipeline.for(action));

    return this;
  }

  private concat = ({ routeMap }: RoutingContext) => {
    routeMap.forEach((rm: Map<HTTPMethodType, ActionPipeline>, path: string) => {
      this._routes.set(path, rm);
    });

    return this;
  }


  public get = (path: string, action: ActionInterface): RoutingContext =>
    this.match(path, 'GET', action)

  public post = (path: string, action: ActionInterface): RoutingContext =>
    this.match(path, 'POST', action)

  public put = (path: string, action: ActionInterface): RoutingContext =>
    this.match(path, 'PUT', action)

  public patch = (path: string, action: ActionInterface): RoutingContext =>
    this.match(path, 'PATCH', action)

  public delete = (path: string, action: ActionInterface): RoutingContext =>
    this.match(path, 'DELETE', action)

  public match = (path: string, method: HTTPVerbsType, action: ActionInterface): RoutingContext => {
    let methods: HTTPMethodsType = Array.isArray(method) ? method : [ method ];

    methods = Either.fromNullable(methods)
      .fold((ms: HTTPMethodsType) => ms, (ms: HTTPMethodsType) =>
        ms.includes('GET') && !ms.includes('HEAD') ? ms.concat([ 'HEAD' ]) : ms
      )
    ;

    methods.forEach((m: HTTPMethodType) => this.addRoute(path, m, action));

    return this;
  }

  public get routeMap(): Map<string, Map<string, ActionPipeline>> {
    return this._routes;
  }

  private pathWithPrefix = (path: string): string =>
    this._prefix.concat(path)

  public getPrefix = () => this._prefix;
}

export abstract class Router {
  private static _routes: RoutingContext = RoutingContext.for('');
  public static prefix = Router._routes.prefix;
  public static get = Router._routes.get;
  public static post = Router._routes.post;
  public static match = Router._routes.match;
  public static routeMap = () => Router._routes;
}

// Router.prefix('/api/v1', (r) => r.get('/', (ctx) => ctx));
// Router.prefix('/api/v2', (r) => r.get('/1', (ctx) => ctx));
//
// Router.post('/', (ctx) => ctx);
// Router.get('/', (ctx) => ctx).get('/1', (ctx) => ctx);

// import { ActionInterface } from './interface/action.interface';
// import { All, Either, EitherType, Pair } from '@totemish/core';
// import { normalizeRoute, normalizeTrailingSlashes } from './helper/normalize-route.helper';
// import { PathType } from './type/route.type';
// import { HTTPMethodsType, HTTPMethodType, HTTPVerbsType } from './enum/http-method.enum';
// import { ActionPipeline } from './pipeline';
//
// export class RoutingContext {
//   public static empty = (): RoutingContext => new RoutingContext();
//
//   private _routes: Map<PathType, Map<string, ActionPipeline>>;
//   private _prefix: string;
//
//   public constructor(prefix?: PathType) {
//     this._routes = new Map();
//     this._prefix = normalizeRoute(prefix).fold(() => '', (p) => p);
//   }
//
//   public hasRoute = (path: string): boolean =>
//     !!this.getRouteToPath(path)
//
//   public hasMethod = (path: string) => (method: HTTPMethodType): boolean =>
//     this.getMethods(path).includes(method)
//
//   public hasAction = (path: string) => (method: HTTPMethodType): boolean =>
//     !!this.getContextMap(path).fold(() => false, (cm: Map<string, ActionPipeline>) => !!cm.get(method).action)
//
//   public addPath = (path: PathType) => {
//     path = normalizeTrailingSlashes(path).fold(() => '', (u) => u);
//
//     if (path === '') return;
//
//     if (!this._routes.has(this.uri(path))) {
//       this._routes.set(path, new Map());
//     }
//
//     return this.addMethod;
//   }
//
//   public addMethod = (path: string) => (method: HTTPMethodType) => {
//     if (this.hasMethod(path)(method)) return this.addAction;
//
//     this.
//   }
//
//   public addAction = (path: string) => (method: HTTPMethodType) => (action: ActionInterface) =>
//     this._routes.get(path).get(method).setAction(action)
//
//   private uri = (uri, prefix?) => normalizeRoute(prefix).fold(() => '', (u) => u)
//     .concat(normalizeRoute(uri).fold(() => '', (p) => p))
//
//   public get routes() {
//     return this._routes;
//   }
//
//   public find = (path: string, method) =>
//     this.getRouteToPath(path)
//       .chain((p: string) => Either.fromNullable(this.getContextMap(p)))
//       .chain((cm: Map<HTTPMethodType, ActionPipeline>): ActionPipeline => cm.get(method))
//       .map((ap: ActionPipeline) => ap.toPipeline())
//       .fold(() => undefined, (pipeline) => pipeline)
//
//
//   // public merge = (routing: RoutingContext) => Array.from(routing.routes.entries()).forEach((r) => {
//   //   const addUri = this.addRoute(this.uri(r[0], routing._prefix));
//   //
//   //   r[1].forEach((p) => {
//   //     p.value.forEach((f) => {
//   //       const found = routing._middleware;
//   //       console.log(found, r[0], p.key);
//   //     });
//   //   });
//   //
//   //   r[1].forEach((p) => p.value.forEach((v) => addUri(p.key, v)));
//   // })
//
//   public sort = () => this._routes = new Map(Array.from(this._routes.entries()).sort());
//
//   public get = (route: RegExp | string, cb: ActionInterface) =>
//     this.match(route, 'GET', cb)
//
//   public post = (route: RegExp | string, cb: ActionInterface) =>
//     this.match(route, 'POST', cb)
//
//   public put = (route: RegExp | string, cb: ActionInterface) =>
//     this.match(route, 'PUT', cb)
//
//   public delete = (route: RegExp | string, cb: ActionInterface) =>
//     this.match(route, 'DELETE', cb)
//
//   public patch = (route: RegExp | string, cb: ActionInterface) =>
//     this.match(route, 'PATCH', cb)
//
//   public match = (route: RegExp | string, methods: HTTPVerbsType, cb: ActionInterface) => {
//     let normalizedMethods = typeof methods === 'string' ? Array.of(methods) : methods;
//
//     if (All.of(normalizedMethods.includes('GET')).concat(All.of(!normalizedMethods.includes('HEAD'))).isTrue) {
//       normalizedMethods = normalizedMethods.concat('HEAD');
//     }
//
//     const resultRoute = normalizeRoute(route);
//
//     normalizedMethods.forEach((method) => {
//       this.addRoute(resultRoute)(method, Either.of(this._middleware).fold(() => {}, (x) => x.concat(<any> [cb])));
//     });
//
//     return this;
//   }
//
//   // public prefix = (prefix: RegExp | string, functions: (router: RoutingContext) => RoutingContext): RoutingContext => {
//   //   this.merge(<RoutingContext> functions(new RoutingContext(prefix, [])));
//   //
//   //   return this;
//   // }
//
//   /**
//    * Get list of methods available for given route path.
//    * @param {string} path
//    * @returns {HTTPVerbsType}
//    */
//   public getMethods = (path: string): HTTPMethodsType => Either.fromNullable(this.getContextMap(path))
//     .fold(() => [], (cm: Map<string, ActionPipeline>) => Array.from(cm.keys()))
//
//   /**
//    * Get context map for given route path.
//    * @param {string} path
//    * @returns {EitherType<Map<string, ActionPipeline> | PathType>}
//    */
//   public getContextMap = (path: string): EitherType<Map<string, ActionPipeline> | PathType> => this.getRouteToPath(path)
//     .chain((p) => Either.fromNullable(this._routes.get(p)))
//
//   /**
//    * Get route name stored in RoutingContext that matches given route path.
//    * @param {string} uri
//    * @returns {EitherType<PathType>}
//    */
//   public getRouteToPath = (uri: string): EitherType<PathType> =>
//     Either.fromNullable(Array
//       .from(this._routes.keys())
//       .find((k: string) => new RegExp(strict(k), 'i').test(uri))
//     )
// }
//
// export const strict = (uri) => `^${uri}$`;
