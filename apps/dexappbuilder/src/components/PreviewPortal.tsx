import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import { useMemo, useState } from 'react';

import { useIsMobile } from '@dexkit/core';
import { getWindowUrl } from '@dexkit/core/utils/browser';
import '@react-page/editor/lib/index.css';
import { FormattedMessage } from 'react-intl';
import { useThemeMode } from 'src/hooks/app/useThemeMode';

interface PreviewIframeProps {
  isMobile?: boolean;
  isfullscreen?: number;
  isdesktopview?: boolean;
}

const PreviewIframe = styled('iframe')<PreviewIframeProps>(({ theme, isMobile, isfullscreen, isdesktopview }) => ({
  border: 'none',
  height: isfullscreen ? '100vh' : (isMobile ? '90vh' : '85vh'),
  width: isfullscreen ? '100vw' : (isMobile && isdesktopview ? '150%' : (isMobile ? '100%' : theme.spacing(62.5))),
  maxWidth: isfullscreen ? '100vw' : (isMobile && isdesktopview ? '150%' : (isMobile ? '100%' : theme.spacing(62.5))),
  transform: isMobile && isdesktopview ? 'scale(0.7)' : 'none',
  transformOrigin: 'top left',
  overflow: 'auto',
  ...(isMobile && !isfullscreen && {
    minHeight: '85vh',
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  }),
  ...(!isMobile && !isfullscreen && {
    minHeight: '80vh',
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  }),
}));

export interface PreviewPortalProps {
  index?: number;
  site?: string;
  page?: string;
  previewPlatform?: 'desktop' | 'mobile';
}

export const PreviewPortal = ({ index, site, page, previewPlatform = 'mobile' }: PreviewPortalProps) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { mode } = useThemeMode();
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const url = useMemo(() => {
    const temp = new URL(getWindowUrl());

    temp.pathname = `/admin/preview/${site}/${page}`;

    if (index !== undefined && index >= 0) {
      temp.searchParams.set('index', index.toString());
    }

    temp.searchParams.set('platform', previewPlatform);

    temp.searchParams.set('themeMode', mode);

    temp.searchParams.delete('disableLayout');

    return temp.toString();
  }, [site, page, index, previewPlatform, mode]);

  const isDesktopView = previewPlatform === 'desktop';
  const shouldBeFullscreen = isMobile && !isDesktopView;

  return (
    <Box
      sx={{
        position: 'relative',
        width: isMobile ? (isDesktopView ? '160%' : '100%') : 'auto',
        height: shouldBeFullscreen ? '100vh' : (isMobile ? '90vh' : '85vh'),
        overflow: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: isDesktopView && isMobile ? 'flex-start' : 'center',
        ml: isDesktopView && isMobile ? -2 : 0,
        ...(isMobile && !shouldBeFullscreen && {
          padding: theme.spacing(0.5),
          minHeight: '85vh',
        }),
        ...(!isMobile && !shouldBeFullscreen && {
          padding: theme.spacing(0.5),
          minHeight: '80vh',
        }),
      }}
    >
      <PreviewIframe
        onLoad={() => setIsLoading(false)}
        src={url}
        isMobile={isMobile}
        isfullscreen={shouldBeFullscreen ? 1 : 0}
        isdesktopview={isDesktopView ? true : false}
      />
      {isLoading && (
        <Backdrop
          sx={{
            color: theme.palette.common.white,
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
          open
        >
          <Stack
            alignItems="center"
            alignContent="center"
            justifyContent="center"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            spacing={2}
          >
            <CircularProgress size={theme.spacing(4.5)} color="primary" />
            <Typography textAlign="center" variant="body1">
              <FormattedMessage
                id="loading.content"
                defaultMessage="Loading content"
              />
            </Typography>
          </Stack>
        </Backdrop>
      )}
    </Box>
  );
};

PreviewPortal.displayName = 'PreviewPortal';
