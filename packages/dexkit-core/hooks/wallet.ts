import { useMutation, useQuery } from "@tanstack/react-query";
import { Token } from "../types";

import { ChainId } from "../constants";
import { NETWORK_PROVIDER } from "../constants/networkProvider";
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
      return;
    }

    return await getPricesByChain(chainId, tokens, currency);
  });
}

export const ENS_NAME_QUERY = "ENS_NAME_QUERY";

export function useEnsNameQuery({ address }: { address?: string | null }) {
  return useQuery([ENS_NAME_QUERY, address], async () => {
    if (!address) {
      return null;
    }
    if (address.split(".").length < 2) {
      return null;
    }

    const provider = NETWORK_PROVIDER(ChainId.Ethereum);
    if (!provider) {
      return null;
    }

    return await provider.resolveName(address);
  });
}

export function useEnsNameMutation() {
  return useMutation(async (address: string) => {
    if (!address) {
      return;
    }
    if (address.split(".").length < 2) {
      return;
    }

    const provider = NETWORK_PROVIDER(ChainId.Ethereum);
    if (!provider) {
      return;
    }

    return await provider.resolveName(address);
  });
}
