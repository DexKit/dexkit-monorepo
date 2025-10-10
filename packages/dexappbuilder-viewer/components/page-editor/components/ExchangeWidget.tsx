import { Token } from "@dexkit/core/types";
import { isAddressEqual, parseChainId } from "@dexkit/core/utils";
import { DexkitExchangeSettings } from "@dexkit/exchange/types";
import { useActiveChainIds, useAppConfig, useCurrency } from "@dexkit/ui";
import { Box } from '@mui/material';
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ExchangeSection from "../../sections/ExchangeSection";

interface Props {
  formData: DexkitExchangeSettings & {
    lockedBaseToken?: Token;
    lockedQuoteToken?: Token;
  };
  isEditMode?: boolean;
}

function ExchangeWidget(props: Props) {
  const { activeChainIds } = useActiveChainIds();
  const { isEditMode, formData } = props;
  const { tokens: appTokens } = useAppConfig();
  const params = useSearchParams();

  const configParams = useMemo(() => {
    const chainId = parseChainId(params?.get("chainId") ?? "0");
    const baseTokenAddress = params?.get("baseToken");
    const quoteTokenAddress = params?.get("quoteToken");

    let tokens = appTokens?.length ? appTokens[0].tokens || [] : [];

    let baseToken: Token | undefined;
    let quoteToken: Token | undefined;

    if (chainId && baseTokenAddress) {
      baseToken = tokens.find(
        (t: any) =>
          isAddressEqual(t.address, baseTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    if (chainId && quoteTokenAddress) {
      quoteToken = tokens.find(
        (t: any) =>
          isAddressEqual(t.address, quoteTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    return { baseToken, quoteToken, chainId };
  }, [params, appTokens]);

  const [chainId, setChainId] = useState<number>();

  useEffect(() => {
    if (isEditMode || formData?.defaultNetwork) {
      setChainId(formData?.defaultNetwork);
    }
  }, [formData?.defaultNetwork, isEditMode]);

  const currency = useCurrency();

  const baseSettings: DexkitExchangeSettings = {
    defaultNetwork: formData.defaultNetwork,
    defaultPairs: formData.defaultPairs || {},
    defaultTokens: formData.defaultTokens || {},
    availNetworks: formData.availNetworks || [],
    variant: formData.variant,
    glassSettings: formData.glassSettings,
    customVariantSettings: formData.customVariantSettings,
    zrxApiKey: formData.zrxApiKey,
    buyTokenPercentageFee: formData.buyTokenPercentageFee,
    feeRecipientAddress: formData.feeRecipientAddress,
    affiliateAddress: formData.affiliateAddress,
    defaultSlippage: formData.defaultSlippage,
    quoteToken: formData.quoteToken,
    container: formData.container,
  };

  if (formData.lockedBaseToken) {
    baseSettings.quoteToken = formData.lockedQuoteToken;
  }

  const chainIdToUse = formData.lockedBaseToken?.chainId || formData.defaultNetwork;

  if (formData.lockedBaseToken && formData.lockedQuoteToken) {
    const chainIdNumber = Number(chainIdToUse);
    baseSettings.defaultPairs = {
      ...baseSettings.defaultPairs,
      [chainIdNumber]: {
        baseToken: formData.lockedBaseToken,
        quoteToken: formData.lockedQuoteToken,
      },
    };

    baseSettings.defaultTokens = {
      ...baseSettings.defaultTokens,
      [chainIdNumber]: {
        baseTokens: [formData.lockedBaseToken],
        quoteTokens: [formData.lockedQuoteToken],
      },
    };
  }

  const selectedChainId =
    !isEditMode ? chainIdToUse : undefined;

  return (
    <Box
      sx={{
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ExchangeSection
        section={{
          settings: baseSettings,
          type: "exchange" as const,
          title: "exchange"
        }}
        key={JSON.stringify(baseSettings)}
      />
    </Box>
  );
}

export default React.memo(ExchangeWidget); 