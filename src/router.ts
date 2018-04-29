import { HTTPMethodsType, HTTPMethodType } from './enum/http-method.enum';
import { ActionPipeline } from './pipeline';
import { ActionInterface } from './interface/action.interface';
import { Either, EitherType } from '@totemish/core';
import { PathType } from './type/path.type';
import { normalizeRoute } from './helper/normalize-route.helper';
import { normalizeTrailingSlashes } from './helper/normalize-trailing-slashes.helper';

export class Router {
  public static for = (prefix: PathType, beforeMw = [], afterMw = []): Router => new Router(prefix, beforeMw, afterMw);
  public static empty = (): Router => Router.for('');

  private readonly _routes: Map<string, Map<HTTPMethodType, ActionPipeline>> = new Map();
  private readonly _prefix: string;
  private _beforeMw: ActionInterface[];
  private _afterMw: ActionInterface[];

  public constructor(prefix: PathType = '', beforeMw: ActionInterface[] = [], afterMw: ActionInterface[] = []) {
    this._prefix = normalizeRoute(typeof prefix === 'string' ? prefix : prefix.source);
    this._beforeMw = beforeMw;
    this._afterMw = afterMw;
  }

  public find = (path: string, method: HTTPMethodType): EitherType<ActionPipeline | Map<HTTPMethodType, ActionPipeline>> => {
    const routeFound = this.getRouteToPath(path).fold(() => undefined, (r: string) => r);

    return Either
      .fromNullable(this._routes.get(routeFound))
      .chain((rc: Map<HTTPMethodType, ActionPipeline>) =>
        Either.fromNullable(rc.get(method)),
      );
  }

  public before = (...mw: ActionInterface[]): Router => {
    this._beforeMw = Array.from(new Set([ ...this._beforeMw, ...mw ]));

    return this;
  }

  public after = (...mw: ActionInterface[]): Router => {
    this._afterMw = Array.from(new Set([ ...this._afterMw, ...mw ]));

    return this;
  }

  public getRouteToPath = (path: string): EitherType<string> =>
    Either.fromNullable(Array.from(this._routes.keys())
      .find((k: string) => new RegExp(`^${k}$`, 'i').test(this.pathWithPrefix(path)),
      ),
    )

  public middleware = (mw: ActionInterface | ActionInterface[], of: (router: Router) => Router) =>
    this.concat(of(Router.for(this._prefix, Array.from(new Set([ ...this._beforeMw, ...Array.isArray(mw) ? mw : [ mw ] ])), this._afterMw)))

  public prefix = (prefix: PathType, of: (router: Router) => Router) =>
    this.concat(of(Router.for(this._prefix.concat(typeof prefix === 'string' ? prefix : prefix.source))))

  public getMethods = (path: string) =>
    Either.fromNullable(Array.from(this._routes.keys())
      .find((k: string) => new RegExp(`^${k}$`, 'i').test(this.pathWithPrefix(path))),
    ).fold(() => [], (r: string) => Array.from(this._routes.get(r).keys()))

  private addRoute = (path: string, method: HTTPMethodType, action: ActionInterface): Router => {
    if (!this._routes.has(path)) {
      this._routes.set(path, new Map());
    }

    this._routes.get(path).set(method, ActionPipeline.for(action));

    return this;
  }

  private concat = (o: Router) => {
    Array.from(o.routeMap.values()).forEach((e: Map<HTTPMethodType, ActionPipeline>) => {
      Array.from(e.values()).forEach((p: ActionPipeline) => {
        p.addBefore(Array.from(new Set([ ...this._beforeMw, ...o._beforeMw ])));
        p.addAfter(Array.from(new Set([ ...this._afterMw, ...o._afterMw ])));
      });
    });

    o.routeMap.forEach((rm: Map<HTTPMethodType, ActionPipeline>, path: string) => {
      this._routes.set(path, rm);
    });

    return this;
  }


  public get = (path: PathType, action: ActionInterface): Router =>
    this.match(path, 'GET', action)

  public post = (path: PathType, action: ActionInterface): Router =>
    this.match(path, 'POST', action)

  public put = (path: PathType, action: ActionInterface): Router =>
    this.match(path, 'PUT', action)

  public patch = (path: PathType, action: ActionInterface): Router =>
    this.match(path, 'PATCH', action)

  public delete = (path: PathType, action: ActionInterface): Router =>
    this.match(path, 'DELETE', action)

  public match = (path: PathType, method: HTTPMethodType | HTTPMethodsType, action: ActionInterface): Router => {
    const normalizedPath = normalizeTrailingSlashes(this.pathWithPrefix(normalizeRoute(path)));
    let methods: HTTPMethodsType = Array.isArray(method) ? method : [ method ];

    methods = Either.fromNullable(methods)
      .fold((ms: HTTPMethodsType) => ms, (ms: HTTPMethodsType) =>
        ms.includes('GET') && !ms.includes('HEAD') ? ms.concat([ 'HEAD' ]) : ms,
      )
    ;

    methods.forEach((m: HTTPMethodType) => this.addRoute(normalizedPath, m, action));

    return this;
  }

  public get routeMap(): Map<string, Map<string, ActionPipeline>> {
    return this._routes;
  }

  private pathWithPrefix = (path: string): string =>
    this._prefix.concat(path)
}
