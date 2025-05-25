import type { CellPlugin } from '@react-page/editor';

import UserContractFormPluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/UserContractFormPlugin';
import { Box } from '@mui/material';
import { UserContractForm } from '../../forms/UserContractForm';

// you can pass the shape of the data as the generic type argument
const UserContractFormPlugin: CellPlugin<{
  formId?: number;
  hideFormInfo?: boolean;
}> = {
  ...UserContractFormPluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      return (
        <Box p={2}>
          <UserContractForm
            onCancel={() => {}}
            onSave={(formId?: number, hideFormInfo?: boolean) => {
              if (formId) {
                onChange({ formId, hideFormInfo });
              }
            }}
            onChange={(formId?: number, hideFormInfo?: boolean) => {
              if (formId) {
                onChange({ formId, hideFormInfo });
              }
            }}
            formId={data.formId}
            hideFormInfo={data.hideFormInfo}
            saveOnChange
          />
        </Box>
      );
    },
  },
};

export default UserContractFormPlugin;
