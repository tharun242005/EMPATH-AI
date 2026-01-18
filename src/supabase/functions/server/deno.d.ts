/// <reference types="https://deno.land/x/types/index.d.ts" />

declare global {
  const Deno: {
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
    env: {
      get: (key: string) => string | undefined;
    };
  };
  
  const console: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };
}

// Allow npm: imports - these are Deno-specific import specifiers
// TypeScript doesn't natively support them, but they work at runtime
declare module "npm:hono" {
  export class Hono {
    constructor();
    use(path: string | "*", ...middleware: any[]): this;
    get(path: string, handler: (c: any) => any): this;
    post(path: string, handler: (c: any) => any): this;
    fetch: (req: Request) => Response | Promise<Response>;
  }
}

declare module "npm:hono/cors" {
  export function cors(options?: {
    origin?: string | string[] | ((origin: string) => string | undefined);
    allowMethods?: string[];
    allowHeaders?: string[];
    exposeHeaders?: string[];
    maxAge?: number;
  }): (c: any, next: () => Promise<any>) => Promise<any>;
}

declare module "npm:hono/logger" {
  export function logger(
    logFn?: (message: string) => void
  ): (c: any, next: () => Promise<any>) => Promise<any>;
}

export {};

