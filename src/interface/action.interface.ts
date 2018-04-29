import { ControllerInterface } from './controller.interface';
import { IncomingMessage, ServerResponse } from 'http';
import { HTTPMethodType } from '../enum/http-method.enum';

export interface ActionInterface extends ControllerInterface {
  uri?: RegExp;
  template?: string | (() => string);
  method?: HTTPMethodType;
  (req: IncomingMessage, res: ServerResponse): void | Promise<void>;
}
