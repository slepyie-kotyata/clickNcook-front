declare interface Env {
  readonly NODE_ENV: string;
  NG_APP_API: string;

  [key: string]: any;
}

declare interface ImportMeta {
  readonly env: Env;
}
