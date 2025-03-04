import type { CellPlugin } from '@react-page/editor';

import { DexkitApiProvider } from '@dexkit/core/providers';
import DexGeneratorFormPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/DexGeneratorFormPlugin';
import { DexGeneratorPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box } from '@mui/material';
import { myAppsApi } from 'src/services/whitelabel';
import DexGeneratorSectionForm from '../../forms/DexGeneratorSectionForm';

// you can pass the shape of the data as the generic type argument
const DexGeneratorFormPlugin: CellPlugin<{
  section?: DexGeneratorPageSection;
}> = {
  ...DexGeneratorFormPluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Box p={2}>
          <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
            <DexGeneratorSectionForm
              onCancel={() => {}}
              section={data.section}
              onSave={(section: DexGeneratorPageSection) => {
                onChange({ section });
              }}
              onChange={(section: DexGeneratorPageSection) => {
                onChange({ section });
              }}
            />
          </DexkitApiProvider.Provider>
        </Box>
      );
    },
  },
};

export default DexGeneratorFormPlugin;
