import { Stack, useMediaQuery, useTheme } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';
import { useMemo } from 'react';

type Data = {
  padding: number;
  spacing: number;
  direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  position: string;
  forceCenterOnMobile?: boolean;
  mobileTextAlign?: 'left' | 'center' | 'right';
  mobileImageAlign?: 'left' | 'center' | 'right';
  mobileButtonAlign?: 'left' | 'center' | 'right';
};

const StackPlugin: CellPlugin<Data> = {
  Renderer: ({ children, data }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const position = useMemo(() => {
      if (isMobile && data.forceCenterOnMobile) {
        return 'center';
      }

      if (data.position === 'center') {
        return 'center';
      }
      if (data.position === 'start') {
        return 'flex-start';
      }
      if (data.position === 'end') {
        return 'flex-end';
      }
    }, [data.position, isMobile, data.forceCenterOnMobile]);

    const mobileTextAlign = data.mobileTextAlign || 'inherit';
    const mobileImageAlign = data.mobileImageAlign || 'inherit';
    const mobileButtonAlign = data.mobileButtonAlign || 'inherit';

    return (
      <Stack
        sx={{
          p: data.padding,
          textAlign: isMobile && data.forceCenterOnMobile ? 'center' : mobileTextAlign,
          alignItems: isMobile && data.forceCenterOnMobile ? 'center' : position,
          justifyContent: isMobile && data.forceCenterOnMobile ? 'center' : position,
          width: '100%',
          ...(isMobile && data.forceCenterOnMobile && {
            '& > *': {
              textAlign: 'center !important',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            },
            '& img, & .next-image-wrapper': {
              margin: '0 auto',
              display: 'block',
            },
            '& p, & div, & span, & h1, & h2, & h3, & h4, & h5, & h6': {
              textAlign: 'center !important',
              width: '100%',
            },
            '& [data-slate-node="text"], & [data-slate-leaf="true"]': {
              textAlign: 'center !important',
              width: '100%',
            },
            '& *': {
              textAlign: 'center !important',
            },
            '& .slate-p, & .slate-div, & .slate-span': {
              textAlign: 'center !important',
              width: '100%',
              display: 'block',
            },
            '& [style*="text-align: left"], & [style*="text-align: start"]': {
              textAlign: 'center !important',
            },
            '& [style*="display: inline"]': {
              display: 'block !important',
              textAlign: 'center !important',
              width: '100%',
            }
          })
        }}
        direction={data.direction}
      >
        {children}
      </Stack>
    );
  },
  id: 'stack',
  title: 'Stack',
  description:
    'Manages layout of children components along vertical and horizontal axis',
  version: 1,
  controls: {
    type: 'autoform',
    schema: {
      properties: {
        padding: {
          type: 'number',
          default: 2,
          minimum: 0,
        },
        position: {
          type: 'string',
          title: 'Position',
          enum: ['center', 'start', 'end'],
        },
        direction: {
          type: 'string',
          title: 'Direction',
          enum: ['row', 'row-reverse', 'column', 'column-reverse'],
        },
        forceCenterOnMobile: {
          type: 'boolean',
          title: 'Force center on mobile',
          default: false,
        },
        mobileTextAlign: {
          type: 'string',
          title: 'Mobile text alignment',
          enum: ['left', 'center', 'right'],
          default: 'inherit',
        },
        mobileImageAlign: {
          type: 'string',
          title: 'Mobile image alignment',
          enum: ['left', 'center', 'right'],
          default: 'inherit',
        },
        mobileButtonAlign: {
          type: 'string',
          title: 'Mobile button alignment',
          enum: ['left', 'center', 'right'],
          default: 'inherit',
        },
      },
      required: [],
    },
  },
};

export default StackPlugin;
