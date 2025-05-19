import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
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
  const [previewPlatform, setPreviewPlatform] = useState<any>('desktop');
  const isMobile = useIsMobile();
  const theme = useTheme();

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
    <>
      <Stack
        alignItems={'center'}
        direction={'row'}
        justifyContent={'center'}
        alignContent={'center'}
        spacing={2}
        sx={{ pb: isMobile ? 1 : 2, pt: isMobile ? 1 : 2, backgroundColor: 'background.default' }}
      >
        {title ? title : null}
        <PreviewPlatformType
          type={previewPlatform}
          setType={(newType) => setPreviewPlatform(newType)}
        />
      </Stack>
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        {previewPlatform === 'desktop' &&
          (enableOverflow ? (
            <Box
              sx={{
                maxHeight: isMobile ? theme.spacing(37.5) : theme.spacing(62.5), // 300px/500px
                overflow: 'auto',
              }}
            >
              {pagePreview}
            </Box>
          ) : (
            <>{pagePreview}</>
          ))}
        {previewPlatform === 'mobile' && (
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            alignContent={'center'}
          >
            {page && site ? (
              <PreviewPortal page={page} site={site} index={index} />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '375px',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius * 2,
                  overflow: 'hidden'
                }}
              >
                {pagePreview}
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </>
  );
}
