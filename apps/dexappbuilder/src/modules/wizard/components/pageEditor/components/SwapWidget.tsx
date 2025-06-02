import { SwapConfig } from '@/modules/swap/types';
import { ChainId } from '@dexkit/core';
import { useActiveChainIds } from '@dexkit/ui';
import { SwapWidget as Swap } from '@dexkit/widgets/src/widgets/swap';
import React, { useEffect, useState } from 'react';
import { useCurrency } from 'src/hooks/currency';
import { useSwapState } from '../../../../../hooks/swap';

interface Props {
  formData?: SwapConfig;
  isEditMode?: boolean;
}

function SwapWidget(props: Props) {
  const { activeChainIds } = useActiveChainIds();
  const { isEditMode, formData } = props;
  const defaultChainId = formData?.defaultChainId;
  const configByChain = formData?.configByChain;

  const [chainId, setChainId] = useState<number>();

  useEffect(() => {
    if (isEditMode) {
      setChainId(defaultChainId);
    }
  }, [defaultChainId, isEditMode]);

  const currency = useCurrency();

  const swapState = useSwapState();

  return (
    <Swap
      {...swapState}
      activeChainIds={activeChainIds}
      renderOptions={{
        ...swapState.renderOptions,

        configsByChain: configByChain ? configByChain : {},
        defaultChainId: chainId || ChainId.Ethereum,
        currency,
        zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
        transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
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
