import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  variant?: 'button' | 'caption' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'overline';
  color?: string;
  sx?: object;
}

export default function MarkdownRenderer({
  content,
  variant = 'body1',
  color = 'text.primary',
  sx = {}
}: MarkdownRendererProps) {
  if (!content) {
    return null;
  }

  return (
    <Typography
      variant={variant}
      color={color}
      component="div"
      sx={{
        '& h1': {
          fontSize: '2rem',
          fontWeight: 600,
          margin: '1rem 0 0.5rem 0',
        },
        '& h2': {
          fontSize: '1.5rem',
          fontWeight: 600,
          margin: '0.75rem 0 0.5rem 0',
        },
        '& h3': {
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: '0.5rem 0 0.25rem 0',
        },
        '& h4': {
          fontSize: '1.125rem',
          fontWeight: 600,
          margin: '0.5rem 0 0.25rem 0',
        },
        '& h5': {
          fontSize: '1rem',
          fontWeight: 600,
          margin: '0.5rem 0 0.25rem 0',
        },
        '& h6': {
          fontSize: '0.875rem',
          fontWeight: 600,
          margin: '0.5rem 0 0.25rem 0',
        },
        '& p': {
          margin: '0.5rem 0',
        },
        '& strong': {
          fontWeight: 600,
        },
        '& em': {
          fontStyle: 'italic',
        },
        '& code': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          padding: '0.125rem 0.25rem',
          borderRadius: '0.25rem',
          fontSize: '0.875em',
        },
        '& pre': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          padding: '1rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          margin: '1rem 0',
        },
        '& blockquote': {
          borderLeft: '4px solid #e0e0e0',
          paddingLeft: '1rem',
          margin: '1rem 0',
          fontStyle: 'italic',
        },
        '& ul, & ol': {
          margin: '0.5rem 0',
          paddingLeft: '1.5rem',
        },
        '& li': {
          margin: '0.25rem 0',
        },
        ...sx,
      }}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </Typography>
  );
} 