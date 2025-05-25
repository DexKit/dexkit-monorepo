import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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

  const containerHeight = isMobile ?
    (previewPlatform === 'mobile' ? '100vh' : theme.spacing(37.5)) :
    theme.spacing(62.5);

  return (
    <Box
      sx={{
        height: isMobile && previewPlatform === 'mobile' ? '100vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="center"
        alignContent="center"
        spacing={2}
        sx={{
          pb: isMobile ? 1 : 2,
          pt: isMobile ? 1 : 2,
          backgroundColor: 'background.default',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar
        }}
      >
        {title || null}
        <PreviewPlatformType
          type={previewPlatform}
          setType={(newType) => setPreviewPlatform(newType)}
        />
      </Stack>
      <Box
        sx={{
          p: isMobile ? 1 : 2,
          flex: 1,
          overflow: 'auto',
          height: previewPlatform === 'mobile' && isMobile ? 'calc(100vh - 56px)' : 'auto'
        }}
      >
        {previewPlatform === 'desktop' &&
          (enableOverflow ? (
            <Box
              sx={{
                maxHeight: containerHeight,
                overflow: 'auto',
              }}
            >
              {pagePreview}
            </Box>
          ) : (
            <Box sx={{ overflow: 'auto' }}>
              {pagePreview}
            </Box>
          ))}
        {previewPlatform === 'mobile' && (
          <Stack
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            sx={{
              height: isMobile ? '100%' : 'auto',
              overflow: 'auto'
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
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '375px',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius * 2,
                  overflow: 'auto',
                  height: isMobile ? '100%' : 'auto'
                }}
              >
                {pagePreview}
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
