// lazy load this file to keep initial bundle small

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as style } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CodeSnippet: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => (
  <SyntaxHighlighter wrapLongLines language={language} style={style}>
    {code}
  </SyntaxHighlighter>
);

export default CodeSnippet;
