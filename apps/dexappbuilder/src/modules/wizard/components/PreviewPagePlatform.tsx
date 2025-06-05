import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { PreviewPortal } from 'src/components/PreviewPortal';

import { useIsMobile } from '@dexkit/core';
import {
  AppConfig,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { useTheme } from '@mui/material/styles';
import PreviewPage from './PreviewPage';
import { PreviewPlatformType } from './PreviewPlatformType';

interface Props {
  sections?: AppPageSection[];
  disabled?: boolean;
  withLayout?: boolean;
  appConfig?: AppConfig;
  title?: React.ReactNode;
  enableOverflow?: boolean;
  page?: string;
  site?: string;
  index?: number;
  layout?: PageSectionsLayout;
}

export default function PreviewPagePlatform({
  sections,
  disabled,
  withLayout,
  appConfig,
  title,
  enableOverflow,
  page,
  site,
  index,
  layout,
}: Props) {
  const [previewPlatform, setPreviewPlatform] = useState<'desktop' | 'mobile'>('desktop');
  const isMobile = useIsMobile();
  const theme = useTheme();

  useEffect(() => {
    if (isMobile) {
      setPreviewPlatform('mobile');
    }
  }, [isMobile]);

  const pagePreview = (
    <PreviewPage
      sections={sections}
      disabled={disabled}
      previewPlatform={previewPlatform}
      withLayout={withLayout}
      appConfig={appConfig}
      layout={layout}
    />
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          py: theme.spacing(1),
          px: theme.spacing(2),
          backgroundColor: 'background.default',
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={theme.spacing(2)}
        >
          {title}
          <PreviewPlatformType
            type={previewPlatform}
            setType={(newType) => setPreviewPlatform(newType)}
          />
        </Stack>
      </Paper>

      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {previewPlatform === 'desktop' ? (
          <Box
            sx={{
              flex: 1,
              overflow: enableOverflow ? 'auto' : 'hidden',
              p: theme.spacing(2)
            }}
          >
            {pagePreview}
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: theme.spacing(2),
              overflow: 'hidden'
            }}
          >
            {page && site ? (
              <PreviewPortal
                page={page}
                site={site}
                index={index}
                previewPlatform={previewPlatform}
              />
            ) : (
              <Paper
                elevation={2}
                sx={{
                  width: '100%',
                  maxWidth: theme.spacing(50),
                  height: 'fit-content',
                  borderRadius: theme.spacing(3),
                  overflow: enableOverflow ? 'auto' : 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  p: theme.spacing(2)
                }}
              >
                {pagePreview}
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
