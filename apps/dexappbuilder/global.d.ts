// Global type declarations to fix build issues with Next 15 and React 19

declare module 'json-stable-stringify' {
  export interface Options {
    cmp?: (a: any, b: any) => number;
    space?: string | number;
    replacer?: (key: string, value: any) => any;
  }
  
  function stringify(value: any, options?: Options): string;
  export = stringify;
}

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

declare module 'react' {
  function findDOMNode(instance: any): Element | null;
}

declare module 'next/document' {
  interface DocumentProps {
    emotionStyleTags?: React.ReactElement[];
  }
}

declare module 'next/script' {
  interface ScriptProps {
    src?: string;
    strategy?: 'afterInteractive' | 'beforeInteractive' | 'lazyOnload';
  }
}

declare module 'next/document' {
  interface DocumentProps {
    emotionStyleTags?: React.ReactElement[];
  }
  
  class Document extends React.Component<DocumentProps> {
    static getInitialProps(ctx: any): Promise<any>;
  }
  
  export { Head, Html, Main, NextScript };
}
