// lazy load this file to keep initial bundle small

import { useIsMobile } from '@dexkit/core';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as style } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeSnippet: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => {
  const isMobile = useIsMobile();

  return (
    <SyntaxHighlighter
      wrapLongLines
      language={language}
      style={style}
      customStyle={{
        fontSize: isMobile ? '0.7rem' : '0.9rem',
        borderRadius: '4px',
        maxHeight: isMobile ? '200px' : undefined
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeSnippet;
