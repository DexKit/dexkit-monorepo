import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import MainLayout from 'src/components/layouts/main';

import { SectionsRenderer } from '@dexkit/dexappbuilder-viewer/components/SectionsRenderer';
import {
  AppConfig,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
interface Props {
  sections?: AppPageSection[];
  disabled?: boolean;
  previewPlatform: 'mobile' | 'desktop';
  withLayout?: boolean;
  appConfig?: AppConfig;
  layout?: PageSectionsLayout;
  editable?: boolean;
  onLayoutChange?: (layouts: any) => void;
}

export default function PreviewPage({
  sections,
  disabled,
  previewPlatform,
  withLayout,
  appConfig,
  layout,
  editable,
  onLayoutChange,
}: Props) {
  const renderSections = () => {
    return <SectionsRenderer
      layout={layout}
      sections={sections ?? []}
      previewPlatform={previewPlatform}
      editable={editable}
      onLayoutChange={onLayoutChange}
    />;
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