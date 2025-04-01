import { ChainId } from "@dexkit/core";
import type { providers } from "ethers";

import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import {
  ZEROEX_ORDERBOOK_ENDPOINT,
  ZERO_EX_V1_URL,
} from "@dexkit/ui/modules/swap/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BigNumber } from "bignumber.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ZEROEX_AFFILIATE_ADDRESS } from "../constants/zrx";
import { DexkitExchangeContext } from "../contexts";
import { getGeckoTerminalTopPools } from "../services";
import {
  DexkitExchangeContextState,
  DexkitExchangeSettings,
  GtPool,
} from "../types";
import { createZrxOrder } from "../utils";

export function useExchangeContext() {
  return useContext(DexkitExchangeContext);
}

export function useSendLimitOrderMutation() {
  const context = useExchangeContext();
  const trackUserEvent = useTrackUserEventsMutation();
  return useMutation(
    async ({
      expirationTime,
      makerAmount,
      makerToken,
      provider,
      takerAmount,
      takerToken,
      chainId,
      maker,
    }: {
      expirationTime: number;
      makerAmount: string;
      makerToken: string;
      provider: providers.Web3Provider;
      takerAmount: string;
      takerToken: string;
      chainId: ChainId;
      maker?: string;
    }) => {
      if (!maker) {
        return null;
      }

      const signedOrder = await createZrxOrder({
        maker,
        chainId,
        expirationTime,
        makerAmount: new BigNumber(makerAmount),
        makerToken,
        provider,
        takerAmount: new BigNumber(takerAmount),
        takerToken,
      });

      const resp = await axios.post(
        `${ZERO_EX_V1_URL(chainId)}${ZEROEX_ORDERBOOK_ENDPOINT}`,
        signedOrder,
        context.zrxApiKey
          ? { headers: { "0x-api-key": context.zrxApiKey } }
          : undefined
      );

      await trackUserEvent.mutateAsync({
        event: UserEvents.postLimitOrder,
        metadata: JSON.stringify({
          order: signedOrder,
        }),
      });

      return resp.data;
    }
  );
}

const GETCKO_TERMINAL_TOP_POOLS_QUERY = "GETCKO_TERMINAL_TOP_POOLS_QUERY";

export function useGeckoTerminalTopPools({
  network,
  address,
}: {
  network?: string;
  address?: string;
}) {
  return useQuery<GtPool[] | null>(
    [GETCKO_TERMINAL_TOP_POOLS_QUERY, network, address],
    async () => {
      if (!address || !network) {
        return null;
      }

      const resp = await getGeckoTerminalTopPools({ address, network });

      return resp.data.data;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
}

export function useExchangeContextState(params: {
  settings?: DexkitExchangeSettings;
}): DexkitExchangeContextState {
  const { settings } = params;

  const { account, provider } = useWeb3React();

  const [defaultChain, setDefaultChain] = useState<ChainId>();
  const [quoteToken, setQuoteToken] = useState<Token | undefined>();
  const [baseToken, setBaseToken] = useState<Token | undefined>();

  const [quoteTokens, setQuoteTokens] = useState<Token[]>([]);
  const [baseTokens, setBaseTokens] = useState<Token[]>([]);

  const handleSetPair = useCallback((base: Token, quote: Token) => {
    setQuoteToken(quote);
    setBaseToken(base);
  }, []);

  const handleSwitchNetwork = async (chainId: ChainId) => {
    setDefaultChain(chainId);
  };

  let currChainId = useMemo(() => {
    if (settings) {
      return defaultChain;
    }

    return ChainId.Ethereum;
  }, [settings, defaultChain]);

  useEffect(() => {
    if (settings && currChainId) {
      const defaultPair =
        settings.defaultPairs && settings.defaultPairs[currChainId]
          ? settings.defaultPairs[currChainId]
          : { baseToken: undefined, quoteToken: undefined };

      const defaultTokens =
        settings.defaultTokens && settings.defaultTokens[currChainId]
          ? settings.defaultTokens[currChainId]
          : { baseTokens: [], quoteTokens: [] };

      setQuoteToken(defaultPair.quoteToken);
      setBaseToken(defaultPair.baseToken);
      setQuoteTokens(defaultTokens.quoteTokens);
      setBaseTokens(defaultTokens.baseTokens);
    }
  }, [currChainId, settings?.defaultTokens, settings?.defaultPairs]);

  useEffect(() => {
    setDefaultChain(settings?.defaultNetwork);
  }, [settings?.defaultNetwork]);

  return {
    setPair: handleSetPair,
    onSwitchNetwork: handleSwitchNetwork,
    baseToken,
    quoteToken,
    baseTokens,
    quoteTokens,
    tokens: {},
    chainId: currChainId,
    provider,
    account,
    container: settings?.container,
    availNetworks: settings?.availNetworks || [],
    feeRecipient: settings?.feeRecipientAddress || ZEROEX_AFFILIATE_ADDRESS,
    affiliateAddress: settings?.affiliateAddress || ZEROEX_AFFILIATE_ADDRESS,
    buyTokenPercentageFee: settings?.buyTokenPercentageFee,
    zrxApiKey: settings?.zrxApiKey
      ? settings.zrxApiKey
      : process.env.NEXT_PUBLIC_ZRX_API_KEY,
  };
}
