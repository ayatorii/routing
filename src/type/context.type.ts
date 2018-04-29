import { IncomingMessage, ServerResponse } from 'http';

/**
 * Extensive request interface.
 * @interface Request
 * @extends IncomingMessage
 */
export interface Request extends IncomingMessage {
  [key: string]: any;
}

/**
 * Extensive response interface.
 * @interface Response
 * @extends ServerResponse
 */
export interface Response extends ServerResponse {
  [key: string]: any;
}

/**
 * Action interface context.
 * @interface ContextType
 */
export interface ContextType {
  req: Request;
  res: Response;
}
