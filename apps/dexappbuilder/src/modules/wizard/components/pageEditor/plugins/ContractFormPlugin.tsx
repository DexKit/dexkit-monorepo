import type { CellPlugin } from '@react-page/editor';
import ContractForm from '../../forms/ContractForm';

import { ContractFormParams } from '@dexkit/web3forms/types';

import { Box } from '@mui/material';

import ContractFormPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/ContractFormPlugin';

// you can pass the shape of the data as the generic type argument
const ContractFormPlugin: CellPlugin<ContractFormParams> = {
  ...ContractFormPluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => (
      <Box p={2}>
        <ContractForm
          updateOnChange
          params={data}
          onChange={onChange}
          onSave={onChange}
        />
      </Box>
    ),
  },
};

export default ContractFormPlugin;
