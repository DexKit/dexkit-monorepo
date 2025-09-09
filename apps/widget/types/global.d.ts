declare module "json-stable-stringify" {
  function stringify(obj: any, opts?: any): string;
  export = stringify;
}

declare module "minimatch" {
  function minimatch(target: string, pattern: string, options?: any): boolean;
  export = minimatch;
}

declare module "*" {
  const value: any;
  export = value;
}
