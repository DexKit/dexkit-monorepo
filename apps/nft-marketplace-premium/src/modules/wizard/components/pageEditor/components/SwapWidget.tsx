import { SwapConfig } from '@/modules/swap/types';
import { ChainId } from '@dexkit/core';
import { SwapWidget as Swap } from '@dexkit/widgets';
import React, { useEffect, useState } from 'react';
import { useCurrency } from 'src/hooks/currency';
import { useSwapState } from '../../../../../hooks/swap';

interface Props {
  formData?: SwapConfig;
  isEditMode?: boolean;
}

function SwapWidget(props: Props) {
  const { isEditMode, formData } = props;
  const defaultChainId = formData?.defaultChainId;
  const defaultEditChainId = formData?.defaultEditChainId;
  const configByChain = formData?.configByChain;

  const [chainId, setChainId] = useState(
    isEditMode ? defaultEditChainId : defaultChainId
  );

  useEffect(() => {
    if (isEditMode) {
      setChainId(defaultEditChainId);
    } else {
      setChainId(defaultChainId);
    }
  }, [defaultChainId, isEditMode, defaultEditChainId]);

  const currency = useCurrency();

  const swapState = useSwapState();

  return (
    <Swap
      renderOptions={{
        configsByChain: configByChain ? configByChain : {},
        defaultChainId: chainId || ChainId.Ethereum,
        currency,
        zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
        transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
      }}
      {...swapState}
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
