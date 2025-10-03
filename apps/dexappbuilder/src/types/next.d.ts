declare module 'next/document' {
  import { Component } from 'react';
  
  interface DocumentProps {
    emotionStyleTags?: React.ReactElement[];
  }
  
  class Document extends Component<DocumentProps> {
    static getInitialProps(ctx: any): Promise<any>;
  }
  
  export default Document;
  export const Head: React.ComponentType<any>;
  export const Html: React.ComponentType<any>;
  export const Main: React.ComponentType<any>;
  export const NextScript: React.ComponentType<any>;
}

declare module 'next/script' {
  interface ScriptProps {
    id?: string;
    src?: string;
    strategy?: 'afterInteractive' | 'beforeInteractive' | 'lazyOnload';
    children?: React.ReactNode;
  }
  
  const Script: React.ComponentType<ScriptProps>;
  export default Script;
}
