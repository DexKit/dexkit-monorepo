// lazy load this file to keep initial bundle small

import { useIsMobile } from '@dexkit/core';
import { useTheme } from '@mui/material';

const CodeSnippet = ({ code, language }: {
  code: string;
  language: string;
}) => {
  const isMobile = useIsMobile();
  const theme = useTheme();

  return (
    <div>
      <pre style={{
        fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
        borderRadius: theme.shape.borderRadius,
        maxHeight: isMobile ? theme.spacing(25) : 'none',
        padding: theme.spacing(2),
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        overflow: 'auto'
      }}>
        {code}
      </pre>
    </div>
  );
};

export default CodeSnippet;
