import { AssetFormType } from '@/modules/wizard/types';
import AssetAltPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/AssetAltPlugin';
import AssetSectionForm from '../../forms/AssetSectionForm';

// you can pass the shape of the data as the generic type argument
const AssetAltPlugin: any = {
  ...AssetAltPluginViewer,
  controls: {
    type: 'custom',
    Component: ({
      data,
      onChange,
    }: {
      data: AssetFormType;
      onChange: (section: AssetFormType) => void;
    }) => {
      return (
        <AssetSectionForm
          section={{ type: 'asset-section', config: data }}
          onChange={(section) => {
            onChange(section.config);
          }}
          onCancel={() => {}}
          onSave={(section) => {
            onChange(section.config);
          }}
        />
      );
    },
  },
};

export default AssetAltPlugin;
