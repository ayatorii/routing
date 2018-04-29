import { AppFactory } from './src';
import { Router } from './src/router';
import { Shell } from '@totemish/shell';
import { ActionInterface } from './src/interface/action.interface';
import { Request } from './src/request';
import { Response } from './src/response';
import { RoutingContext } from './src/routing-context';

// export * from './src';
export class TestController {
  public static index: ActionInterface = (req, res) => {
    res.write('<h1>Helloushki</h1>');
  }

  public static about: ActionInterface = (req, res) => {
    res.write('<h1>Hello</h1>');
  }
}

export module NSController {
  export const qp: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };
}

export module AuthController {
  export const signIn: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };

  export const signUp: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };
}

export module PostController {
  export const list: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };

  export const create: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };

  export const get: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };

  export const edit: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };

  export const remove: ActionInterface = (req: Request, res: Response) => {
    res.write(JSON.stringify({req: {qp: req.qp, params: req.params}}));
  };
}

/*
 * - [ ] TODO add middleware
 */

Router.post('/', TestController.index);
Router.get('/', NSController.qp);

Router.match('/about', 'GET', TestController.about);

Router.match('/sign-up', [ 'GET', 'POST' ], AuthController.signUp);



export const testMw = (x = 1) => (req, res) => {
  res.setHeader('test', x);
  console.log(x)

  return { req, res };
}

export const testMw2 = (x = 2) => (req, res) => {
  console.log(x);

  return { req, res };
}

Router.middleware([ testMw() ], (router) =>
  router
    .get('/sign-in', AuthController.signIn)
    .post('/sign-in', AuthController.signIn)
);

Router.prefix('/api/v1', (router: RoutingContext) => {
  router.match('/doc', [ 'GET', 'POST' ], (req, res) => res.end('APIDoc'));

  router.prefix('/(posts|comments)', (postsRouter: RoutingContext) =>
    postsRouter
      .get('/', PostController.list)
      .post('/', PostController.create)
      .get('/(\\d+)', PostController.get)
      .patch('/(\\d+)', PostController.edit)
      .delete('/(\\d+)', PostController.remove)
  );

  return router;
});

const app = AppFactory.create();
app.listen(8000);

console.log(Router.context);

Shell.success(`Server running on localhost:8000`);
