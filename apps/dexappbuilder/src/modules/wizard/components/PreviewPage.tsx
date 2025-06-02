import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import MainLayout from 'src/components/layouts/main';

import {
  AppConfig,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
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
  const renderSections = () => {
    // return (sections || []).map((section, key) => {
    //   if (previewPlatform === 'mobile' && section?.hideMobile) {
    //     return null;
    //   }
    //   if (previewPlatform === 'desktop' && section?.hideDesktop) {
    //     return null;
    //   }

    //   return <SectionRender section={section} key={key} />;
    // });
    return <SectionsRenderer layout={layout} sections={sections ?? []} />;
  };
  if (withLayout) {
    return (
      <MainLayout disablePadding appConfigProps={appConfig} isPreview={true}>
        {renderSections() || null}{' '}
      </MainLayout>
    );
  } else {
    return <>{renderSections() || null}</>;
  }
}
