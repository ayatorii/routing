import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { expect } from 'chai';
import { DefaultMiddleware } from './default.middleware';
import { Router } from './router';

describe('Default Middleware', () => {
  describe('AllowMethods', () => {
    it('should assign `Access-Control-Allow-Methods` header on the response object', () => {
      const req = new IncomingMessage(new Socket());
      const res = new ServerResponse(req);
      const ctx = { req, res };

      expect(DefaultMiddleware.AllowMethods(Router.empty())(ctx).res.getHeaders())
        .to.have.key('Access-Control-Allow-Methods'.toLowerCase())
      ;
    });
  });
});
