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
import { EXCHANGE_SUPPORTED_NETWORKS } from "../constants";
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
      signer,
      takerAmount,
      takerToken,
      chainId,
      maker,
    }: {
      expirationTime: number;
      makerAmount: string;
      makerToken: string;
      signer: providers.JsonRpcSigner;
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
        signer,
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

  const { account, signer, provider } = useWeb3React();

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
    if (EXCHANGE_SUPPORTED_NETWORKS.includes(chainId)) {
      setDefaultChain(chainId);
    }
  };

  const filteredAvailNetworks = useMemo(() => {
    if (!settings?.availNetworks) return [];
    return settings.availNetworks.filter(chainId =>
      EXCHANGE_SUPPORTED_NETWORKS.includes(chainId)
    );
  }, [settings?.availNetworks]);

  let currChainId = useMemo(() => {
    if (settings) {
      if (defaultChain && EXCHANGE_SUPPORTED_NETWORKS.includes(defaultChain)) {
        return defaultChain;
      }

      if (settings.defaultNetwork && EXCHANGE_SUPPORTED_NETWORKS.includes(settings.defaultNetwork)) {
        return settings.defaultNetwork;
      }

      if (filteredAvailNetworks.length > 0) {
        return filteredAvailNetworks[0];
      }

      if (EXCHANGE_SUPPORTED_NETWORKS.includes(ChainId.Ethereum)) {
        return ChainId.Ethereum;
      }

      return EXCHANGE_SUPPORTED_NETWORKS[0];
    }

    return ChainId.Ethereum;
  }, [settings, defaultChain, filteredAvailNetworks]);

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
    if (settings?.defaultNetwork && EXCHANGE_SUPPORTED_NETWORKS.includes(settings.defaultNetwork)) {
      setDefaultChain(settings.defaultNetwork);
    } else if (filteredAvailNetworks.length > 0) {
      setDefaultChain(filteredAvailNetworks[0]);
    }
  }, [settings?.defaultNetwork, filteredAvailNetworks]);

  return {
    setPair: handleSetPair,
    onSwitchNetwork: handleSwitchNetwork,
    baseToken,
    quoteToken,
    baseTokens,
    quoteTokens,
    tokens: {},
    chainId: currChainId,
    signer,
    provider,
    account,
    container: settings?.container,
    availNetworks: filteredAvailNetworks,
    feeRecipient: settings?.feeRecipientAddress || ZEROEX_AFFILIATE_ADDRESS,
    affiliateAddress: settings?.affiliateAddress || ZEROEX_AFFILIATE_ADDRESS,
    buyTokenPercentageFee: settings?.buyTokenPercentageFee,
    zrxApiKey: settings?.zrxApiKey
      ? settings.zrxApiKey
      : process.env.NEXT_PUBLIC_ZRX_API_KEY,
    variant: settings?.variant || "default",
    customVariantSettings: settings?.customVariantSettings,
    glassSettings: settings?.glassSettings,
  };
}
