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
  editable?: boolean;
  onLayoutChange?: (layouts: any) => void;
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
  editable,
  onLayoutChange,
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
      editable={editable}
      onLayoutChange={onLayoutChange}
    />
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        minHeight: 0
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
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: 2
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: previewPlatform === 'mobile' ? '375px' : '100%',
            height: 'auto',
            minHeight: previewPlatform === 'mobile' ? '600px' : '500px',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column'
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
                height: '100%',
                borderRadius: previewPlatform === 'mobile' ? theme.spacing(2) : theme.spacing(1),
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                ...(previewPlatform === 'mobile' && {
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: '600px'
                }),
              }}
            >
              {pagePreview}
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
