import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { isAddressEqual, parseChainId } from "@dexkit/core/utils";
import { useActiveChainIds, useAppConfig, useCurrency } from "@dexkit/ui";
import { useSwapState } from "@dexkit/ui/modules/swap/hooks";
import { SwapConfig } from "@dexkit/ui/modules/wizard/types";
import { SwapWidget as Swap } from "@dexkit/widgets/src/widgets/swap";
import { ChainConfig } from "@dexkit/widgets/src/widgets/swap/types";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  formData?: SwapConfig;
  isEditMode?: boolean;
}

function SwapWidget(props: Props) {
  const { activeChainIds } = useActiveChainIds();
  const { isEditMode, formData } = props;
  const defaultChainId = formData?.defaultChainId;
  const { tokens: appTokens } = useAppConfig();
  const configByChain = formData?.configByChain;
  const variant = formData?.variant;
  const params = useSearchParams();

  const configParams = useMemo(() => {
    const chainId = parseChainId(params?.get("chainId") ?? "0");
    const buyTokenAddress = params?.get("buyToken");
    const sellTokenAddress = params?.get("sellToken");

    let tokens = appTokens?.length ? appTokens[0].tokens || [] : [];

    let buyToken: Token | undefined;
    let sellToken: Token | undefined;

    if (chainId && buyTokenAddress) {
      buyToken = tokens.find(
        (t) =>
          isAddressEqual(t.address, buyTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    if (chainId && sellTokenAddress) {
      sellToken = tokens.find(
        (t) =>
          isAddressEqual(t.address, sellTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    if (chainId) {
      let configByChainParams: { [chainId: number]: ChainConfig } = {
        ...configByChain,
        [chainId]: {
          slippage: 0,
          ...configByChain?.[chainId],
        },
      };

      if (configByChain?.[chainId]?.slippage) {
        configByChainParams[chainId].slippage =
          configByChain?.[chainId].slippage;
      }

      if (buyToken) {
        configByChainParams[chainId].buyToken = buyToken;
      } else if (configByChain?.[chainId]?.buyToken && configByChainParams) {
        configByChainParams[chainId].buyToken =
          configByChain?.[chainId].buyToken;
      }

      if (sellToken) {
        configByChainParams[chainId].sellToken = sellToken;
      } else if (configByChain?.[chainId]?.sellToken && configByChainParams) {
        configByChainParams[chainId].sellToken =
          configByChain?.[chainId].sellToken;
      }

      return { configByChainParams, chainId };
    }
  }, [params, appTokens, formData]);

  const enableUrlParams = Boolean(formData?.enableUrlParams);

  const [chainId, setChainId] = useState<number>();

  useEffect(() => {
    if (isEditMode) {
      setChainId(defaultChainId);
    }
  }, [defaultChainId, isEditMode]);

  const currency = useCurrency();

  const swapState = useSwapState();

  let selectedChainId =
    enableUrlParams && !isEditMode ? configParams?.chainId : undefined;

  return (
    <Swap
      {...swapState}
      activeChainIds={activeChainIds}
      renderOptions={{
        ...swapState.renderOptions,
        useGasless: formData?.useGasless,
        myTokensOnlyOnSearch: formData?.myTokensOnlyOnSearch,
        variant: variant,
        enableUrlParams: enableUrlParams,
        enableImportExterTokens: formData?.enableImportExternTokens,
        configsByChain:
          enableUrlParams && configParams?.configByChainParams
            ? configParams.configByChainParams
            : configByChain
            ? configByChain
            : {},
        defaultChainId: selectedChainId || chainId || ChainId.Ethereum,
        currency: currency.currency,
        zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || "",
        transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || "",
      }}
    />
  );
}

export default React.memo(SwapWidget);

{
  /* <NoSsr>
<QueryErrorResetBoundary>
  {({ reset }) => (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary, error }) => (
        <Paper sx={{ p: 1 }}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h6">
              <FormattedMessage
                id="something.went.wrong"
                defaultMessage="Oops, something went wrong"
                description="Something went wrong error message"
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {String(error)}
            </Typography>
            <Button color="primary" onClick={resetErrorBoundary}>
              <FormattedMessage
                id="try.again"
                defaultMessage="Try again"
                description="Try again"
              />
            </Button>
          </Stack>
        </Paper>
      )}
    >
      <Suspense fallback={<SwapSkeleton />}>
        <Swap
          defaultChainId={chainId}
          onChangeChainId={handleChangeChainId}
          defaultSellToken={
            defaultSellToken
              ? {
                  address: defaultSellToken.contractAddress,
                  chainId: defaultSellToken.chainId as number,
                  decimals: defaultSellToken.decimals,
                  symbol: defaultSellToken?.symbol,
                  name: defaultSellToken.name,
                  logoURI: defaultSellToken.logoURI || '',
                }
              : undefined
          }
          defaultBuyToken={
            defaultBuyToken
              ? {
                  address: defaultBuyToken.contractAddress,
                  chainId: defaultBuyToken.chainId as number,
                  decimals: defaultBuyToken.decimals,
                  symbol: defaultBuyToken?.symbol,
                  name: defaultBuyToken.name,
                  logoURI: defaultBuyToken.logoURI || '',
                }
              : undefined
          }
          defaultSlippage={slippage}
          isEditMode={isEditMode}
        />
      </Suspense>
    </ErrorBoundary>
  )}
</QueryErrorResetBoundary>
</NoSsr> */
}
