import { ContextType } from '../type/context.type';

/**
 * Action interface describes any kind of magic that goes on with the request and response.
 * @interface ActionInterface
 */
export interface ActionInterface {
  (ctx: ContextType): ContextType | void;
}
