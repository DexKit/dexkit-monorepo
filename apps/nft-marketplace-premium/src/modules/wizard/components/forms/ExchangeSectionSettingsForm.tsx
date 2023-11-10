import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { useMemo } from 'react';
import { useAppWizardConfig } from '../../hooks';
import { ExchangePageSection } from '../../types/section';

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

  return (
    <ExchangeSettingsForm
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
    />
  );
}
