import { useMutation, useQuery } from "@tanstack/react-query";
import { Token } from "../types";

import { client } from "@dexkit/wallet-connectors/thirdweb/client";
import { resolveAddress } from "thirdweb/extensions/ens";
import { ChainId } from "../constants";
import { getPricesByChain } from "../services";

export const COIN_PRICES_QUERY = "COIN_PRICES_QUERY";

export function useCoinPrices({
  currency,
  tokens,
  chainId,
}: {
  tokens?: Token[];
  chainId?: ChainId;
  currency?: string;
}) {
  return useQuery([COIN_PRICES_QUERY, chainId, tokens, currency], async () => {
    if (!chainId || !tokens || !currency) {
      return {};
    }

    return await getPricesByChain(chainId, tokens, currency);
  }, {
    enabled: !!(chainId && tokens && currency),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export const ENS_NAME_QUERY = "ENS_NAME_QUERY";

export function useEnsNameQuery({
  address
}: {
  address?: string | null;
}) {
  return useQuery([ENS_NAME_QUERY, address], async () => {
    if (!address) {
      return null;
    }
    if (address.split('.').length < 2) {
      return null
    }

    return await resolveAddress({
      client,
      name: address,
    });

  });
}

export function useEnsNameMutation(
) {
  return useMutation(async (address: string) => {
    if (!address) {
      return;
    }
    if (address.split('.').length < 2) {
      return
    }

    return await resolveAddress({
      client,
      name: address,
    });
  });
}