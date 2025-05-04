declare interface Env {
  readonly NODE_ENV: string;
  NG_APP_API: string;
  NG_APP_WEBSOCKET_API: string;

  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
