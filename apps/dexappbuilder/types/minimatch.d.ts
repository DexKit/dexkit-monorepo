declare module 'minimatch' {
  function minimatch(target: string, pattern: string, options?: any): boolean;
  export = minimatch;
}
