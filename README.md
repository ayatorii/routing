# Routing

[![Core Build Status](https://travis-ci.org/totemish/routing.svg?branch=master)](https://travis-ci.org/totemish/routing)
[![codecov](https://img.shields.io/codecov/c/github/totemish/routing.svg)](https://codecov.io/gh/totemish/routing)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-routing/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![downloads](https://img.shields.io/npm/dt/@totemish/routing.svg)](https://www.npmjs.com/package/@totemish/routing)
[![version](https://img.shields.io/npm/v/@totemish/routing.svg)](https://www.npmjs.com/package/@totemish/routing)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

## Description

Totemish routing is a wrapper for Node.js native HTTP server. It doesn't use any magic wands and lets you go all the
tough way through Node.js jungle. At its core, Totemish routing is built upon middleware that does exactly what you
expect. You have many entry points to put your middleware to get desired results. All the middleware is then put into
a pipeline that is executed on Node.js HTTP server's request and response. Routing in Totemish is based on using RegExp
which gives you incredible control over the routing as well as incredible pain in whatever applicable. Totemish routing
only relies on dependency-free `@totemish/core`.

## Installation

```bash
npm i --save @totemish/routing
```

## Usage

### Simple example

```javascript
import { AppFactory, Router } from '@totemish/routing';

/**
 * Simple middleware to log incoming requests.
 */
const Logger = (ctx) => {
    console.log(`${ctx.req.method}: ${ctx.req.url}`);
    
    return ctx;
}

/**
 * Initialize router. If you want to dive right in, use Router#empty.
 */
const router = Router.empty();

/**
 * Tell the router that in has to use Logger middleware on all the nested routes.
 */
router.middleware(Logger, (r) => {
    /*
     * Here you get another router that will be merged to the parent router as soon as you return it.
     */
    r.get('/', (ctx) => ctx.res.end('Hello from the index page!');
    r.get('/about', (ctx) => ctx.res.end('Under construction');
    
    return r;
});

/**
 * Create an app that exposes our router.
 */
const app = AppFactory.create(router);

/**
 * Start the app by forcing it to listen to given port.
 */
app.listen(8000);

console.log('Server running on port 8000');
```

## Links

* [API (Under Construction)](https://totemish.github.io/routing)
* [Docs (Under Construction)](https://totemish.com/docs/routing)
* [Tutorials (Under Construction)](https://totemish.com/tutorials/routing)
* [Examples (Under Construction)](https://github.com/totemish/examples/routing)