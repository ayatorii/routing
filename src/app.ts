import { createServer, Server } from 'http';
import { Router } from './router';
import { HTTPMethodType } from './enum/http-method.enum';
import { ActionInterface } from './interface/action.interface';
import { ActionPipeline } from './pipeline';
import { DefaultHandlers } from './default.handlers';
import { Either } from '@totemish/core';
import { DefaultExtensions } from './default.extenstions';
import { parse } from 'url';
import { ContextType, Request, Response } from './type/context.type';

/**
 * @class App
 */
export class App {
  /**
   * Create a new instance of the App. Empty app will always return 404 as it has no routing assigned to it.
   * You can assign routing to the app later with App#router setter.
   * @returns {App}
   */
  public static empty = (): App => new App();

  /**
   * Create a new instance of the App for given router.
   * @param {Router} router
   * @returns {App}
   */
  public static for = (router: Router): App => new App(router);

  /**
   * Node.js HTTP server.
   * @type {Server}
   */
  private _server: Server;

  /**
   * Router assigned to the server.
   * @type {Router}
   */
  private _routing: Router;

  /**
   * Handler that will be triggered if the app encounters an error.
   * @default DefaultHandlers.ErrorHandler
   * @type {(error?: Error) => (ctx) => void}
   * @private
   */
  private _errorHandler: ActionInterface | any = DefaultHandlers.ErrorHandler;

  /**
   * Handler that will be triggered if the app cannot find appropriate route for the request.
   * @default DefaultHandlers.NotFoundHandler
   * @type {(ctx) => undefined}
   * @private
   */
  private _notFoundHandler: ActionInterface | any = DefaultHandlers.NotFoundHandler;

  /**
   * Array of functions that make changes to the request and response object. You can refer to it as global middleware.
   * @default DefaultExtensions
   * @type {(((ctx) => any) | ((ctx) => any) | ((ctx) => any))[]}
   * @private
   */
  private _extensions: ActionInterface[] = DefaultExtensions;

  /**
   * @constructor
   * @param {Router} routing
   */
  public constructor(routing?: Router) {
    this._routing = routing;
  }

  /**
   * Start listening for given port on given hostname.
   * @param {number} port
   * @param {string} hostname
   */
  public listen(port: number, hostname: string = 'localhost'): void {
    this._server = createServer()
      .listen(port, hostname)
      .on('request', this.serve)
      .on('error', this._errorHandler)
    ;
  }

  /**
   * Get router.
   * @returns {Router}
   */
  public get router(): Router {
    return this._routing;
  }

  /**
   * Set router.
   * @param {Router} router
   */
  public set router(router: Router) {
    this._routing = router;
  }

  /**
   * Get server.
   * @returns {"http".Server}
   */
  public get server(): Server {
    return this._server;
  }

  /**
   * Set NotFoundHandler.
   * @param {ActionInterface | any} handler
   */
  public set notFoundHandler(handler: ActionInterface | any) {
    this._notFoundHandler = handler;
  }

  /**
   * Set ErrorHandler.
   * @param {ActionInterface | any} handler
   */
  public set errorHandler(handler: ActionInterface | any) {
    this._errorHandler = handler;
  }

  /**
   * Get extensions.
   * @returns {ActionInterface[]}
   */
  public get extensions(): ActionInterface[] {
    return this._extensions;
  }

  /**
   * Set extensions.
   * @param {ActionInterface[]} extensions
   */
  public set extensions(extensions: ActionInterface[]) {
    this._extensions = extensions;
  }

  /**
   * Server server.
   * @param req
   * @param res
   */
  private serve = (req: Request, res: Response): void => {
    let ctx: ContextType = { req, res };

    this._extensions.forEach((e) => ctx = <ContextType> e(ctx));

    res.setHeader('X-Powered-By', 'Totemish');
    req.pathname = parse(req.url).pathname;

    this._routing.find(req.pathname, <HTTPMethodType> req.method).fold(
      () => this._notFoundHandler(ctx),
      (fs: ActionPipeline) => {
        req.params = new RegExp(this._routing.getRouteToPath(req.pathname).fold((r) => r, (r) => r), 'i')
          .exec(req.pathname)
          .slice(1)
        ;

        fs.toPipeline().forEach((f) => Either
          .try(() => f(ctx))
          .fold((e) => this._errorHandler(e)(ctx), (res) => {
            if (!res) {
              return;
            }

            ctx = <ContextType> res;
          }));
      },
    );

    res.end();
  }
}

