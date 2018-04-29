import { App } from './app';
import { Router } from './router';

/**
 * @class AppFactory
 */
export abstract class AppFactory {
  /**
   * Create a new instance of the App.
   * @param {Router} router
   * @returns {App}
   */
  public static create = (router?: Router): App => new App(router);
}
