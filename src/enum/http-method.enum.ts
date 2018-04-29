export enum HTTPMethodEnum {
  GET,
  POST,
  PUT,
  DELETE,
  COPY,
  OPTIONS,
  PATCH,
  HEAD,
  CONNECT,
  LINK,
  UNLINK,
  PURGE,
  LOCK,
  UNLOCK,
  PROFIND,
  VIEW,
  TRACE,
}

export type HTTPMethodType = keyof typeof HTTPMethodEnum;

export type HTTPVerbsType = HTTPMethodType | HTTPMethodType[];
