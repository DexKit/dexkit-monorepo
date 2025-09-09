declare module 'json-stable-stringify' {
  function stringify(obj: any, opts?: any): string;
  export = stringify;
}

declare module 'json-stable-stringify' {
  export default function stringify(obj: any, opts?: any): string;
}
