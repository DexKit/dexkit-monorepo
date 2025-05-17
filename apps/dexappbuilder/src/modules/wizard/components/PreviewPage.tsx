import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import MainLayout from 'src/components/layouts/main';

import {
  AppConfig,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { Box } from '@mui/material';
import { SectionsRenderer } from './sections/SectionsRenderer';
interface Props {
  sections?: AppPageSection[];
  disabled?: boolean;
  previewPlatform: 'mobile' | 'desktop';
  withLayout?: boolean;
  appConfig?: AppConfig;
  layout?: PageSectionsLayout;
}

export default function PreviewPage({
  sections,
  disabled,
  previewPlatform,
  withLayout,
  appConfig,
  layout,
}: Props) {
  if (!sections) {
    return null;
  }

  const content = (
    <Box sx={{
      m: 0,
      p: 0,
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <SectionsRenderer
        sections={sections.filter(
          (s) => {
            if (!s) return true;

            const shouldHideOnDesktop = s.hideDesktop && previewPlatform === 'desktop';
            const shouldHideOnMobile = s.hideMobile && previewPlatform === 'mobile';

            return !(shouldHideOnDesktop || shouldHideOnMobile);
          }
        )}
        layout={layout}
      />
    </Box>
  );

  return withLayout ? (
    <MainLayout disablePadding isPreview={true}>
      {content}
    </MainLayout>
  ) : (
    content
  );
}
