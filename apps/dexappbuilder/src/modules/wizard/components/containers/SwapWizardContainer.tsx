import { SwapConfig } from '@/modules/swap/types';
import { SwapWidget } from '@dexkit/widgets/src/widgets/swap';

import { ChainId } from '@dexkit/core/constants';
import { useActiveChainIds } from '@dexkit/ui';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { SwapPageSection } from '@dexkit/ui/modules/wizard/types/section';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  CssVarsTheme,
  Theme,
} from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useCurrency } from 'src/hooks/currency';
import { Token } from 'src/types/blockchain';
import { useSwapState } from '../../../../hooks/swap';
import { StepperButtonProps } from '../../types';
import { SwapConfigForm } from '../forms/SwapConfigForm';
import { StepperButtons } from '../steppers/StepperButtons';
interface Props {
  config: AppConfig;
  swapTheme: Omit<Theme, 'palette'> & CssVarsTheme;
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
  const { activeChainIds } = useActiveChainIds();
  const [swapFormData, setSwapFormData] = useState<SwapConfig | undefined>(
    (
      config.pages['home']?.sections.find(
        (s) => s.type === 'swap',
      ) as SwapPageSection
    )?.config,
  );

  const featuredTokens = useMemo<Token[]>(() => {
    let tokens = config?.tokens?.length ? config?.tokens[0].tokens || [] : [];

    return tokens
      .filter((t) => !t?.disableFeatured)
      .map<Token>((t: Token) => {
        return {
          address: t.address,
          chainId: t.chainId as number,
          decimals: t.decimals,
          name: t.name,
          symbol: t.symbol,
          logoURI: t.logoURI,
        } as Token;
      });
  }, [config]);

  const nonFeaturedTokens = useMemo<Token[]>(() => {
    let tokens = config?.tokens?.length ? config?.tokens[0].tokens || [] : [];

    return tokens
      .filter((t) => t?.disableFeatured)
      .map<Token>((t: Token) => {
        return {
          address: t.address,
          chainId: t.chainId as number,
          decimals: t.decimals,
          name: t.name,
          symbol: t.symbol,
          logoURI: t.logoURI,
        } as Token;
      });
  }, [config]);

  const tokens = useMemo<Token[]>(() => {
    return config?.tokens?.length ? config?.tokens[0].tokens || [] : [];
  }, [config]);

  const changeConfig = function (
    configToChange: AppConfig,
    formData?: SwapConfig,
  ) {
    const newConfig = { ...configToChange };
    const swapSectionPageIndex = newConfig.pages['home']?.sections.findIndex(
      (s) => s.type === 'swap',
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack>
          <Typography variant={'h6'}>
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
        <SwapConfigForm
          onChange={setSwapFormData}
          data={swapFormData}
          featuredTokens={tokens}
        />
      </Grid>
      <Grid item xs={6}>
        <CssVarsProvider theme={swapTheme}>
          <SwapWidget
            {...swapState}
            activeChainIds={activeChainIds}
            renderOptions={{
              ...swapState.renderOptions,
              configsByChain: swapFormData?.configByChain
                ? swapFormData?.configByChain
                : {},
              defaultChainId: swapFormData?.defaultChainId || ChainId.Ethereum,
              featuredTokens: featuredTokens,
              nonFeaturedTokens: nonFeaturedTokens,
              currency,
              zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
              transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
              useGasless: swapFormData?.useGasless,
              myTokensOnlyOnSearch: swapFormData?.myTokensOnlyOnSearch,
            }}
          />
        </CssVarsProvider>
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
