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
  const [previewPlatform, setPreviewPlatform] = useState<any>('desktop');

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack
        alignItems={'center'}
        direction={'row'}
        justifyContent={'center'}
        alignContent={'center'}
        spacing={2}
        sx={{
          pb: 2,
          pt: 2,
          backgroundColor: 'background.default',
          flexShrink: 0,
        }}
      >
        {title ? title : null}
        <PreviewPlatformType
          type={previewPlatform}
          setType={(newType) => setPreviewPlatform(newType)}
        />
      </Stack>
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {previewPlatform === 'desktop' &&
          (enableOverflow ? (
            <Box
              sx={{
                maxHeight: 'calc(100vh - 200px)',
                minHeight: '600px',
                overflow: 'auto',
                flex: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
              }}
            >
              {pagePreview}
            </Box>
          ) : (
            <Box sx={{ flex: 1 }}>
              {pagePreview}
            </Box>
          ))}
        {previewPlatform === 'mobile' && (
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            alignContent={'center'}
            sx={{ flex: 1 }}
          >
            <PreviewPortal page={page} site={site} index={index} />
          </Stack>
        )}
      </Box>
    </Box>
  );
}