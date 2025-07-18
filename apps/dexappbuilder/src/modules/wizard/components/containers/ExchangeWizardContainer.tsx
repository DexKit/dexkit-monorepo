import { Token as AppToken, TokenWhitelabelApp } from '@dexkit/core/types';
import ExchangeSettingsForm from '@dexkit/exchange/components/ExchangeSettingsForm';
import { ZEROX_SUPPORTED_NETWORKS } from '@dexkit/exchange/constants';
import { DexkitExchangeSettings } from '@dexkit/exchange/types';
import { useActiveChainIds } from '@dexkit/ui/hooks';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { ExchangePageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CssVarsTheme, Theme } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { StepperButtonProps } from '../../types';
import { StepperButtons } from '../steppers/StepperButtons';

interface Props {
  config: AppConfig;
  theme: Omit<Theme, 'palette'> & CssVarsTheme;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function ExchangeWizardContainer({
  config,
  theme,
  onSave,
  onChange,
  onHasChanges,
  isOnStepper,
  stepperButtonProps,
}: Props) {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { activeChainIds } = useActiveChainIds();
  const [hasChanged, setHasChanged] = useState(false);

  const [exchangeFormData, setExchangeFormData] = useState<
    DexkitExchangeSettings | undefined
  >(
    (
      config.pages['home']?.sections.find(
        (s) => s.type === 'exchange',
      ) as ExchangePageSection
    )?.settings,
  );

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanged);
    }
  }, [onHasChanges, hasChanged]);

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
    setHasChanged(false);
  };

  const handleOnChange = (form: DexkitExchangeSettings) => {
    setExchangeFormData(form);
    setHasChanged(true);
    onChange(changeConfig(config, form));
  };

  const [isValid, setIsValid] = useState(false);

  const handleValidate = useCallback((isValid: boolean) => {
    setIsValid(isValid);
  }, []);

  const exchangeActiveChainIds = useMemo(() => {
    return ZEROX_SUPPORTED_NETWORKS;
  }, []);

  const customTheme = useMemo(() => {

    if (config.theme === 'custom') {
      try {
        const customThemeLight = config.customThemeLight ? JSON.parse(config.customThemeLight) : null;
        const customThemeDark = config.customThemeDark ? JSON.parse(config.customThemeDark) : null;

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

    if (theme?.colorSchemes) {
      const extractedTheme = {
        colorSchemes: {
          light: { palette: theme.colorSchemes.light?.palette },
          dark: { palette: theme.colorSchemes.dark?.palette }
        }
      };
      return extractedTheme;
    }
    return null;
  }, [config.theme, config.customThemeLight, config.customThemeDark, theme]);

  return (
    <Grid container spacing={isMobile ? 1.5 : 3}>
      <Grid item xs={12}>
        <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              fontSize: isMobile ? '1.15rem' : '1.5rem',
              fontWeight: 600,
              mb: 0.5
            }}
          >
            <FormattedMessage id="exchange" defaultMessage="Exchange" />
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            color="text.secondary"
            sx={{
              fontSize: isMobile ? '0.85rem' : 'inherit',
            }}
          >
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
          onCancel={() => { }}
          activeChainIds={exchangeActiveChainIds}
          saveOnChange
          onChange={handleOnChange}
          onSave={handleOnChange}
          tokens={tokens}
          onValidate={handleValidate}
          customTheme={customTheme}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontSize: isMobile ? "0.875rem" : undefined,
                py: isMobile ? 0.75 : undefined,
                px: isMobile ? 2 : undefined,
              }}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Stack>
        )}
      </Grid>
    </Grid>
  );
}
