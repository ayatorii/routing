import { createServer, Server, ServerResponse } from 'http';
import * as url from 'url';
import { Request } from './request';
import { Router } from './router';
import { Either } from '@totemish/core';
import * as querystring from 'querystring';
import { Response } from './response';

/**
 * @class App
 */
export class App {
  private server: Server;

  /**
   * @constructor
   */
  public constructor() {

  }

  public listen(port: number, hostname: string = 'localhost'): void {
    Router.sort();

    this.server = createServer()
      .listen(port, hostname)
      .on('request', this.serve)
    ;
  }

  private serve = (req: Request, res: Response): void => {
    res.setHeader('X-Powered-By', 'Totemish');

    const pathName: string = url.parse(req.url).pathname;
    req.qp = querystring.parse(url.parse(req.url).query);

    Either.fromNullable(Router.find(pathName, req.method)).fold(
      () => res.write('Not Found'),
      (fs) => {
        res.setHeader('Access-Control-Allow-Methods', Router.getMethods(pathName).join(', '));
        req.params = new RegExp(Router.getRoute(pathName)).exec(pathName).slice(1);
        let ctx = { req, res };
        fs.forEach((f) => {
          console.log(f.toString());
          ctx = f(ctx.req, ctx.res) || { req, res };
        });
      }
    );

    res.end();
  }
}

export abstract class AppFactory {
  public static create = (): App => new App();
}
