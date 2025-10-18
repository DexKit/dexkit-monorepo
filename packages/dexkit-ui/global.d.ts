// Global type declarations to fix build issues with Next 15 and React 19

declare module 'minimatch' {
  interface IMinimatch {
    pattern: string;
    set: string[][];
    regexp: RegExp | null;
    negate: boolean;
    comment: boolean;
    empty: boolean;
    match(s: string): boolean;
    makeRe(): RegExp | false;
  }
  
  interface IOptions {
    nobrace?: boolean;
    nocomment?: boolean;
    nonegate?: boolean;
    debug?: boolean;
    noglobstar?: boolean;
    noext?: boolean;
    nocase?: boolean;
    nonull?: boolean;
    matchBase?: boolean;
    flipNegate?: boolean;
  }
  
  function minimatch(target: string, pattern: string, options?: IOptions): boolean;
  namespace minimatch {
    function filter(pattern: string, options?: IOptions): (target: string) => boolean;
    function match(list: string[], pattern: string, options?: IOptions): string[];
    function makeRe(pattern: string, options?: IOptions): RegExp | false;
    var Minimatch: new (pattern: string, options?: IOptions) => IMinimatch;
  }
  export = minimatch;
}
