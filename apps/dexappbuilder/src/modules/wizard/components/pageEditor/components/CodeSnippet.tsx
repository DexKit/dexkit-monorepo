// lazy load this file to keep initial bundle small

import { useIsMobile } from '@dexkit/core';
import { useTheme } from '@mui/material';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as style } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeSnippet: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }) => {
  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <SyntaxHighlighter
      wrapLongLines
      language={language}
      style={style}
      customStyle={{
        fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
        borderRadius: theme.shape.borderRadius,
        maxHeight: isMobile ? theme.spacing(25) : undefined
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeSnippet;
