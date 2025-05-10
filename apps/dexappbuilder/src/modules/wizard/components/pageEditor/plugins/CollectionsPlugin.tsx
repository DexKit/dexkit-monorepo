import type { CellPlugin } from '@react-page/editor';

import { CollectionPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box } from '@mui/material';
import CollectionSectionFormAlt from '../../forms/CollectionSectionFormAlt';

import CollectionsPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/CollectionsPlugin';

// you can pass the shape of the data as the generic type argument
const CollectionsPlugin: CellPlugin<{
  section?: CollectionPageSection;
}> = {
  ...CollectionsPluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Box p={2}>
          <CollectionSectionFormAlt
            onCancel={() => {}}
            section={data.section}
            onSave={(section: CollectionPageSection) => {
              onChange({ section });
            }}
            onChange={(section: CollectionPageSection) => {
              onChange({ section });
            }}
          />
        </Box>
      );
    },
  },
};

export default CollectionsPlugin;
