import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';
import { ZEROX_SUPPORTED_NETWORKS } from '@dexkit/exchange/constants';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { useActiveChainIds } from '@dexkit/ui';
import { ExchangePageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useMemo } from 'react';
import { useAppWizardConfig } from '../../hooks';
import { generateCSSVarsTheme } from '../../utils';

interface Props {
  onSave: (section: ExchangePageSection) => void;
  onChange?: (section: ExchangePageSection) => void;
  onCancel: () => void;
  section?: ExchangePageSection;
}

export default function ExchangeSectionSettingsForm({
  onSave,
  onCancel,
  onChange,
  section,
}: Props) {
  const { activeChainIds } = useActiveChainIds();

  const exchangeActiveChainIds = useMemo(() => {
    return ZEROX_SUPPORTED_NETWORKS;
  }, []);

  const handleSave = (settings: DexkitExchangeSettings) => {
    if (onSave) {
      onSave({
        type: 'exchange',
        settings,
      });
    }
    if (onChange) {
      onChange({
        type: 'exchange',
        settings,
      });
    }
  };

  const handleChange = (settings: DexkitExchangeSettings) => {
    if (onChange) {
      onChange({
        type: 'exchange',
        settings,
      });
    }
  };

  const { wizardConfig } = useAppWizardConfig();

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
    <ExchangeSettingsForm
      activeChainIds={exchangeActiveChainIds}
      onCancel={onCancel}
      onSave={handleSave}
      onChange={handleChange}
      saveOnChange={onChange ? true : false}
      showSaveButton={true}
      settings={section?.settings}
      tokens={tokens.map((t) => ({
        chainId: t.chainId,
        address: t.address,
        name: t.name,
        decimals: t.decimals,
        symbol: t.symbol,
        logoURI: t.logoURI,
      }))}
      customTheme={customTheme}
    />
  );
}
