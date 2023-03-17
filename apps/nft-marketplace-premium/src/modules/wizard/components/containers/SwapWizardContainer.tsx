import { SwapConfig } from '@/modules/swap/types';
import { SwapWidget } from '@dexkit/widgets';
import { Token as WidgetToken } from '@dexkit/widgets/src/types';

import { ChainId } from '@dexkit/core/constants';
import { Theme, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCurrency } from 'src/hooks/currency';
import { Token } from 'src/types/blockchain';
import { useSwapState } from '../../../../hooks/swap';
import { AppConfig, SwapPageSection } from '../../../../types/config';
import { StepperButtonProps } from '../../types';
import { SwapConfigForm } from '../forms/SwapConfigForm';
import { StepperButtons } from '../steppers/StepperButtons';
interface Props {
  config: AppConfig;
  swapTheme: Theme;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

export default function SwapWizardContainer({
  config,
  swapTheme,
  onSave,
  onChange,
  isOnStepper,
  stepperButtonProps,
}: Props) {
  const [swapFormData, setSwapFormData] = useState<SwapConfig | undefined>(
    (
      config.pages['home']?.sections.find(
        (s) => s.type === 'swap'
      ) as SwapPageSection
    )?.config
  );

  const featuredTokens = useMemo<WidgetToken[]>(() => {
    let tokens = config?.tokens?.length ? config?.tokens[0].tokens || [] : [];

    return tokens.map<WidgetToken>((t: Token) => {
      return {
        contractAddress: t.address,
        chainId: t.chainId as number,
        decimals: t.decimals,
        name: t.name,
        symbol: t.symbol,
      } as WidgetToken;
    });
  }, [config]);

  const changeConfig = function (
    configToChange: AppConfig,
    formData?: SwapConfig
  ) {
    const newConfig = { ...configToChange };
    const swapSectionPageIndex = newConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'swap'
    );
    let editSwapSection: SwapPageSection;
    if (formData) {
      if (swapSectionPageIndex !== -1) {
        editSwapSection = {
          ...(newConfig.pages['home']?.sections[
            swapSectionPageIndex
          ] as SwapPageSection),
          config: formData,
        };
        newConfig.pages['home'].sections[swapSectionPageIndex] =
          editSwapSection;
      } else {
        editSwapSection = {
          title: 'Swap',
          type: 'swap',
          config: formData,
        };
        newConfig.pages['home']?.sections.push(editSwapSection);
      }
    }
    return newConfig;
  };

  const handleSave = () => {
    onSave(changeConfig(config, swapFormData));
  };

  const handleOnChange = (form: SwapConfig) => {
    setSwapFormData(form);
    onChange(changeConfig(config, swapFormData));
  };

  useEffect(() => {
    onChange(changeConfig(config, swapFormData));
  }, [swapFormData]);

  const swapState = useSwapState();

  const currency = useCurrency();

  console.log();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'subtitle2'}>
            <FormattedMessage id="tokens" defaultMessage="Tokens" />
          </Typography>
          <Typography variant={'body2'}>
            <FormattedMessage
              id="choose.default.settings.for.swap.interface"
              defaultMessage="Choose default settings for swap interface"
            />
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <SwapConfigForm onChange={setSwapFormData} data={swapFormData} />
      </Grid>
      <Grid item xs={6}>
        <ThemeProvider theme={swapTheme}>
          <SwapWidget
            {...swapState}
            renderOptions={{
              ...swapState.renderOptions,
              configsByChain: swapFormData?.configByChain
                ? swapFormData?.configByChain
                : {},
              defaultChainId: swapFormData?.defaultChainId || ChainId.Ethereum,
              featuredTokens: featuredTokens,
              currency,
              zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
              transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
            }}
          />
        </ThemeProvider>
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
            disableContinue={false}
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
