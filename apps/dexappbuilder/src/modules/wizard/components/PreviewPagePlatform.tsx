import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { PreviewPortal } from 'src/components/PreviewPortal';

import {
  AppConfig,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
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
        sx={{ pb: 2, pt: 2, backgroundColor: 'background.default' }}
      >
        {title ? title : null}
        <PreviewPlatformType
          type={previewPlatform}
          setType={(newType) => setPreviewPlatform(newType)}
        />
      </Stack>
      <Box sx={{ p: 2 }}>
        {previewPlatform === 'desktop' &&
          (enableOverflow ? (
            <Box
              sx={{
                maxHeight: '500px',
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
            <PreviewPortal page={page} site={site} index={index} />
          </Stack>
        )}
      </Box>
    </>
  );
}
