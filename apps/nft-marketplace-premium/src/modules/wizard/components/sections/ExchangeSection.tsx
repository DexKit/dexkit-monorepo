import OrdersTable from '@dexkit/exchange/components/OrdersTable';
import TradeWidget from '@dexkit/exchange/components/TradeWidget';
import TradingGraph from '@dexkit/exchange/components/TradingGraph';
import { GET_GECKOTERMINAL_NETWORK } from '@dexkit/exchange/constants';
import { Box, Container, Grid } from '@mui/material';
import { useWeb3React } from '@web3-react/core';

import SelectPairDialog from '@dexkit/exchange/components/dialogs/SelectPairDialog';
import {
  useExchangeContext,
  useExchangeContextState,
  useGeckoTerminalTopPools,
} from '@dexkit/exchange/hooks';
import { useEffect, useMemo, useState } from 'react';

import { Token } from '@dexkit/core/types';
import { isAddressEqual } from '@dexkit/core/utils';
import PairInfo from '@dexkit/exchange/components/PairInfo';
import { DexkitExchangeContext } from '@dexkit/exchange/contexts';
import { ExchangePageSection } from '../../types/section';

function ExchangeSection() {
  const exchangeState = useExchangeContext();

  const { chainId, provider, account } = exchangeState;

  const { isActive } = useWeb3React();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenSelectPair = () => {
    setOpen(true);
  };

  const handleSelectPair = (baseToken: Token, quoteToken: Token) => {
    exchangeState.setPair(baseToken, quoteToken);
    handleClose();
  };

  const network = useMemo(() => {
    return GET_GECKOTERMINAL_NETWORK(chainId);
  }, [chainId]);

  const [selectedAddress, setSelectedAddress] = useState<string>();

  const geckoTerminalTopPoolsQuery = useGeckoTerminalTopPools({
    address: exchangeState.baseToken?.contractAddress,
    network,
  });
  const isLoadingPool = geckoTerminalTopPoolsQuery.isLoading;

  const pools = useMemo(() => {
    if (
      geckoTerminalTopPoolsQuery.data &&
      geckoTerminalTopPoolsQuery.data.length > 0
    ) {
      return geckoTerminalTopPoolsQuery.data;
    }

    return [];
  }, [geckoTerminalTopPoolsQuery.data]);

  const selectedPool = useMemo(() => {
    return pools.find((pool) =>
      isAddressEqual(pool.attributes.address, selectedAddress),
    );
  }, [selectedAddress, pools]);

  const handleChangePool = (value: string) => {
    setSelectedAddress(value);
  };

  useEffect(() => {
    if (pools.length > 0) {
      setSelectedAddress(pools[0].attributes.address);
    }
  }, [pools]);

  const [showSwaps, setShowSwaps] = useState(false);

  const handleChangeShowSwap = (value: boolean) => {
    setShowSwaps(value);
  };

  return (
    <>
      {open && (
        <SelectPairDialog
          DialogProps={{
            open,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleClose,
          }}
          baseToken={exchangeState.baseToken}
          quoteToken={exchangeState.quoteToken}
          baseTokens={exchangeState.baseTokens}
          quoteTokens={exchangeState.quoteTokens}
          onSelectPair={handleSelectPair}
          availNetworks={exchangeState.availNetworks}
          onSwitchNetwork={exchangeState.onSwitchNetwork}
          chainId={exchangeState.chainId}
        />
      )}

      <Box py={2}>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            {exchangeState.quoteToken && exchangeState.baseToken && (
              <Grid item xs={12}>
                <PairInfo
                  quoteToken={exchangeState.quoteToken}
                  baseToken={exchangeState.baseToken}
                  onSelectPair={handleOpenSelectPair}
                  isLoading={isLoadingPool}
                  marketCap={
                    selectedPool?.attributes.market_cap_usd
                      ? selectedPool.attributes.market_cap_usd
                      : undefined
                  }
                  volume={selectedPool?.attributes.volume_usd.h24}
                  priceChangeH24={
                    selectedPool?.attributes.price_change_percentage.h24
                  }
                  lastPrice={selectedPool?.attributes.base_token_price_usd}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <TradeWidget isActive={true} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TradingGraph
                    key={selectedAddress}
                    isLoading={isLoadingPool}
                    onChange={handleChangePool}
                    onChangeShowSwaps={handleChangeShowSwap}
                    selectedPool={selectedAddress}
                    network={network}
                    pools={pools.map((pool) => ({
                      name: pool.attributes.name,
                      address: pool.attributes.address,
                    }))}
                    showSwaps={showSwaps}
                  />
                </Grid>
                <Grid item xs={12}>
                  <OrdersTable
                    account={account}
                    chainId={chainId}
                    provider={provider}
                    active={isActive}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export interface ExchangeSectionProps {
  section: ExchangePageSection;
}

function ExchangeSectionWrapper({ section }: ExchangeSectionProps) {
  const { settings } = section;

  const exchangeState = useExchangeContextState({
    settings,
  });

  return (
    <DexkitExchangeContext.Provider value={exchangeState}>
      <ExchangeSection />
    </DexkitExchangeContext.Provider>
  );
}

export default ExchangeSectionWrapper;
