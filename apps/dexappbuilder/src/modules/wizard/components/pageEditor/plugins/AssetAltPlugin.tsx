import type { CellPlugin } from '@react-page/editor';

import { AssetFormType } from '@/modules/wizard/types';
import AssetAltPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/AssetAltPlugin';
import AssetSectionForm from '../../forms/AssetSectionForm';

// you can pass the shape of the data as the generic type argument
const AssetAltPlugin: CellPlugin<AssetFormType> = {
  ...AssetAltPluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
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
