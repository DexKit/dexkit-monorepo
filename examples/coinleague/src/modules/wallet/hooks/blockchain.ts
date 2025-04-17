import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@/modules/common/constants';
import { ChainId } from '@/modules/common/constants/enums';
import { NETWORKS } from '@/modules/common/constants/networks';
import { getChainLogoImage } from '@/modules/common/utils';
import {
  getChainName,
  getNativeTokenSymbol,
} from '@/modules/common/utils/blockchain';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { Token } from '../types/swap';

export function useCoinList({
  chainId,
  includeNative = false,
}: {
  chainId?: number;
  includeNative?: boolean;
}) {
  const tokenListJson = useMemo(() => {
    return [] as Token[];
  }, []);

  // TODO: do the right logic
  let tokens = tokenListJson;

  return useMemo(() => {
    if (chainId === undefined) {
      return [] as Token[];
    }

    let tokenList = tokens.filter((t) => t.chainId === chainId);

    const wrappedAddress = NETWORKS[chainId]?.wrappedAddress;
    const isNoWrappedTokenInList =
      tokenList &&
      tokenList.findIndex((t) => t.address.toLowerCase() === wrappedAddress) ===
        -1;
    // Wrapped Token is not on the list, we will add it here
    if (wrappedAddress && isNoWrappedTokenInList) {
      tokenList = [
        {
          address: wrappedAddress,
          chainId,
          decimals: 18,
          logoURI: getChainLogoImage(chainId),
          name: `Wrapped ${getNativeTokenSymbol(chainId)}`,
          symbol: `W${getNativeTokenSymbol(chainId)}`,
        } as Token,
        ...tokenList,
      ];
    }

    if (includeNative) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: getChainLogoImage(chainId),
          name: getChainName(chainId),
          symbol: getNativeTokenSymbol(chainId),
        },
        ...tokenList,
      ] as Token[];
    }

    return [...tokenList] as Token[];
  }, [chainId, tokens]);
}

export const ACCOUNT_ENS_QUERY = 'ACCOUNT_ENS_QUERY';

export function useAccountEns({
  account,
  chainId,
  provider,
  disabled,
}: {
  provider?: ethers.providers.Web3Provider;
  account?: string;
  chainId: ChainId;
  disabled?: boolean;
}) {
  return useQuery(
    [ACCOUNT_ENS_QUERY, account, chainId],
    async () => {
      if (!account) {
        throw new Error('invalid address');
      }

      if (!isAddress(account)) {
        throw new Error('invalid address');
      }

      if (chainId !== ChainId.Ethereum) {
        return null;
      }

      return await provider?.lookupAddress(account);
    },
    {
      enabled: !disabled || chainId !== ChainId.Ethereum || Boolean(account),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
