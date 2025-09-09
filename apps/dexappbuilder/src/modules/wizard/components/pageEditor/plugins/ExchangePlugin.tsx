import { useAppWizardConfig } from '@/modules/wizard/hooks';
import { Container } from '@mui/material';
import type { CellPlugin } from '@react-page/editor';

import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';
import { ZEROX_SUPPORTED_NETWORKS } from '@dexkit/exchange/constants';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { useActiveChainIds } from '@dexkit/ui';
import { useMemo } from 'react';
import { generateCSSVarsTheme } from '../../../utils';

import ExchangePluginViewer from '@dexkit/dexappbuilder-viewer/components/page-editor/plugins/ExchangePlugin';

const ExchangePlugin: CellPlugin<DexkitExchangeSettings> = {
  ...(ExchangePluginViewer as any),
  title: "Exchange",
  controls: {
    type: 'custom',
    Component: ({ data, onChange }) => {
      const { activeChainIds } = useActiveChainIds();
      const { wizardConfig } = useAppWizardConfig();

      const exchangeActiveChainIds = useMemo(() => {
        return ZEROX_SUPPORTED_NETWORKS;
      }, []);

      const tokens = useMemo(() => {
        if (wizardConfig.tokens && wizardConfig.tokens?.length > 0) {
          return wizardConfig.tokens[0].tokens;
        }

        return [];
      }, [wizardConfig]);

      const customTheme = useMemo(() => {

        if (wizardConfig.theme === 'custom') {
          try {
            const customThemeLight = wizardConfig.customThemeLight ? JSON.parse(wizardConfig.customThemeLight) : null;
            const customThemeDark = wizardConfig.customThemeDark ? JSON.parse(wizardConfig.customThemeDark) : null;

            const themeData = {
              colorSchemes: {
                light: customThemeLight || {},
                dark: customThemeDark || {}
              }
            };

            return themeData;
          } catch (error) {
            console.error("Error parsing custom theme:", error);
            return null;
          }
        }

        if (wizardConfig.theme) {
          try {
            const customThemeDark = wizardConfig.customThemeDark ? JSON.parse(wizardConfig.customThemeDark) : {};
            const customThemeLight = wizardConfig.customThemeLight ? JSON.parse(wizardConfig.customThemeLight) : {};

            const selectedTheme = generateCSSVarsTheme({
              selectedFont: wizardConfig?.font,
              cssVarPrefix: 'theme-preview',
              customTheme: {
                colorSchemes: {
                  dark: customThemeDark,
                  light: customThemeLight,
                },
              },
              selectedThemeId: wizardConfig?.theme || '',
            });

            if (selectedTheme?.colorSchemes) {
              const extractedTheme = {
                colorSchemes: {
                  light: { palette: selectedTheme.colorSchemes.light?.palette },
                  dark: { palette: selectedTheme.colorSchemes.dark?.palette }
                }
              };
              return extractedTheme;
            }
          } catch (error) {
            console.error("Error generating theme:", error);
          }
        }

        return null;
      }, [wizardConfig.theme, wizardConfig.customThemeLight, wizardConfig.customThemeDark, wizardConfig.font]);

      return (
        <Container sx={{ p: 2 }}>
          <ExchangeSettingsForm
            activeChainIds={exchangeActiveChainIds}
            saveOnChange
            settings={Object.keys(data).length > 0 ? data : undefined}
            onCancel={() => { }}
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
            customTheme={customTheme}
          />
        </Container>
      );
    },
  },
};

export default ExchangePlugin;
