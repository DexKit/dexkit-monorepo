import { useAppWizardConfig } from '@/modules/wizard/hooks';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';

import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { useActiveChainIds } from '@dexkit/ui';
import { useMemo } from 'react';

import ExchangePluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/ExchangePlugin';

// you can pass the shape of the data as the generic type argument
const ExchangePlugin: CellPlugin<DexkitExchangeSettings> = {
  ...ExchangePluginViewer,
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      const { activeChainIds } = useActiveChainIds();
      const { wizardConfig } = useAppWizardConfig();

      const tokens = useMemo(() => {
        if (wizardConfig.tokens && wizardConfig.tokens?.length > 0) {
          return wizardConfig.tokens[0].tokens;
        }

        return [];
      }, [wizardConfig]);

      return (
        <Container sx={{ p: 2 }}>
          <ExchangeSettingsForm
            activeChainIds={activeChainIds}
            saveOnChange
            settings={Object.keys(data).length > 0 ? data : undefined}
            onCancel={() => {}}
            onSave={(settings) => {
              onChange(settings);
            }}
            tokens={tokens.map((t) => ({
              chainId: t.chainId,
              address: t.address,
              decimals: t.decimals,
              symbol: t.symbol,
              name: t.name,
              logoURI: t.logoURI,
            }))}
          />
        </Container>
      );
    },
  },
};

export default ExchangePlugin;
