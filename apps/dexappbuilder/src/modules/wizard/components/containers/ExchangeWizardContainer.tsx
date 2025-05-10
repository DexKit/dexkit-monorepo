import { Token as AppToken, TokenWhitelabelApp } from '@dexkit/core/types';
import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { useActiveChainIds } from '@dexkit/ui/hooks';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { ExchangePageSection } from '@dexkit/ui/modules/wizard/types/section';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CssVarsTheme, Theme } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { StepperButtonProps } from '../../types';
import { StepperButtons } from '../steppers/StepperButtons';
interface Props {
  config: AppConfig;
  theme: Omit<Theme, 'palette'> & CssVarsTheme;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function ExchangeWizardContainer({
  config,
  theme,
  onSave,
  onChange,
  isOnStepper,
  stepperButtonProps,
}: Props) {
  const { activeChainIds } = useActiveChainIds();

  const [exchangeFormData, setExchangeFormData] = useState<
    DexkitExchangeSettings | undefined
  >(
    (
      config.pages['home']?.sections.find(
        (s) => s.type === 'exchange',
      ) as ExchangePageSection
    )?.settings,
  );

  const tokens = useMemo<AppToken[]>(() => {
    let tokens = config?.tokens?.length ? config?.tokens[0].tokens || [] : [];

    let newTokens = tokens.map<AppToken>((t: TokenWhitelabelApp) => {
      return {
        address: t.address,
        chainId: t.chainId as number,
        decimals: t.decimals,
        name: t.name,
        symbol: t.symbol,
        logoURI: t?.logoURI,
      };
    });

    return newTokens;
  }, [config]);

  const changeConfig = function (
    configToChange: AppConfig,
    formData?: DexkitExchangeSettings,
  ) {
    const newConfig = { ...configToChange };

    const sectionIndex = newConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'exchange',
    );

    let exchangeSection: ExchangePageSection;

    if (formData) {
      if (sectionIndex !== -1) {
        exchangeSection = {
          ...(newConfig.pages['home']?.sections[
            sectionIndex
          ] as ExchangePageSection),
          settings: formData,
        };
        newConfig.pages['home'].sections[sectionIndex] = exchangeSection;
      } else {
        exchangeSection = {
          title: 'Exchange',
          type: 'exchange',
          settings: formData,
        };
        newConfig.pages['home']?.sections.push(exchangeSection);
      }
    }

    return newConfig;
  };

  const handleSave = () => {
    onSave(changeConfig(config, exchangeFormData));
  };

  const handleOnChange = (form: DexkitExchangeSettings) => {
    setExchangeFormData(form);
    onChange(changeConfig(config, form));
  };

  const [isValid, setIsValid] = useState(false);

  const handleValidate = useCallback((isValid: boolean) => {
    setIsValid(isValid);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant="subtitle2">
            <FormattedMessage id="exchange" defaultMessage="Exchange" />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage
              id="choose.default.settings.for.exchange.interface"
              defaultMessage="Choose default settings for exchange interface"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <ExchangeSettingsForm
          onCancel={() => {}}
          activeChainIds={activeChainIds}
          saveOnChange
          onChange={handleOnChange}
          onSave={handleOnChange}
          tokens={tokens}
          onValidate={handleValidate}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {isOnStepper ? (
          <StepperButtons
            {...stepperButtonProps}
            handleNext={() => {
              handleSave();
              if (stepperButtonProps?.handleNext) {
                stepperButtonProps.handleNext();
              }
            }}
            disableContinue={!isValid}
          />
        ) : (
          <Stack spacing={1} direction="row" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleSave}>
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
