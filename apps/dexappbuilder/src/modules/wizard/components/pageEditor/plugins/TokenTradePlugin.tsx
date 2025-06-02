import type { CellPlugin } from '@react-page/editor';

import { useAppWizardConfig } from '@dexkit/ui/hooks';
import { TokenTradePageSection } from '@dexkit/ui/modules/wizard/types/section';
import { Box } from '@mui/material';
import { TokenTradeConfigForm } from '../../forms/TokenTradeConfigForm';

import TokenTradePluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/TokenTradePlugin';

// you can pass the shape of the data as the generic type argument
const TokenTradePlugin: CellPlugin<{
  section?: TokenTradePageSection;
}> = {
  ...TokenTradePluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      const { wizardConfig } = useAppWizardConfig();
      return (
        <Box p={2}>
          <TokenTradeConfigForm
            data={data.section?.config}
            onChange={(d) =>
              onChange({
                section: {
                  type: 'token-trade',
                  config: d || {},
                },
              })
            }
            featuredTokens={
              wizardConfig?.tokens ? wizardConfig?.tokens[0].tokens : undefined
            }
          />
        </Box>
      );
    },
  },
};

export default TokenTradePlugin;
