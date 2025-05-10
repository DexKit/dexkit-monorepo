import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { getWindowUrl } from '@dexkit/core/utils/browser';
import '@react-page/editor/lib/index.css';
import { FormattedMessage } from 'react-intl';

const PreviewIframe = styled('iframe')(() => ({
  border: 'none',
  height: '500px',
  width: '500px',
}));

export interface PreviewPortalProps {
  index?: number;
  site?: string;
  page?: string;
}

export const PreviewPortal = ({ index, site, page }: PreviewPortalProps) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const url = useMemo(() => {
    const temp = new URL(getWindowUrl());

    temp.pathname = `/admin/preview/${site}/${page}`;

    if (index !== undefined && index >= 0) {
      temp.searchParams.set('index', index.toString());
      temp.searchParams.set('disableLayout', '1');
    }

    return temp.toString();
  }, [site, page, index]);

  return (
    <Box sx={{ position: 'relative' }}>
      <PreviewIframe onLoad={() => setIsLoading(false)} src={url} />
      {isLoading && (
        <Backdrop sx={{ color: '#fff', position: 'absolute' }} open>
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
            <CircularProgress size="3rem" color="primary" />
            <Typography textAlign="center">
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
