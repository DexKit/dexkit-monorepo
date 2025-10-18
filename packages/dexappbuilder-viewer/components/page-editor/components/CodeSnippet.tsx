// lazy load this file to keep initial bundle small

import React from 'react';

const CodeSnippet: React.FC<{
  code: string;
  language: string;
}> = ({ code, language }: any) => (
  <pre style={{
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    padding: '16px',
    borderRadius: '4px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap'
  }}>
    <code>{code}</code>
  </pre>
);

export default CodeSnippet;
