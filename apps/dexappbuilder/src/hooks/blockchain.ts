import {
  getNativeCurrencyImage,
  getNativeCurrencySymbol,
  getProviderByChainId,
} from '@dexkit/core/utils/blockchain';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSwitchChain } from 'wagmi';
import {
  switchNetworkChainIdAtom,
  switchNetworkOpenAtom,
  tokensAtom,
} from '../state/atoms';

import { Token } from '../types/blockchain';

import { NETWORKS } from '../constants/chain';


import { useAppWizardConfig } from '@/modules/wizard/hooks';
import { ChainId } from '@dexkit/core/constants';
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from '@dexkit/core/constants/zrx';
import { useAppConfig } from './app';


export function useBlockNumber() {
  const { provider } = useWeb3React();


  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (provider) {
      const handleBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };

      provider?.on('block', handleBlockNumber);

      return () => {
        provider?.removeListener('block', handleBlockNumber);
      };
    }
  }, [provider]);

  return blockNumber;
}

export function useSwitchNetwork() {
  const setSwitchOpen = useUpdateAtom(switchNetworkOpenAtom);
  const setSwitchChainId = useUpdateAtom(switchNetworkChainIdAtom);

  const openDialog = useCallback((chainId: number) => {
    setSwitchOpen(true);
    setSwitchChainId(chainId);
  }, []);

  return {
    openDialog,
  };
}

export function useSwitchNetworkMutation() {
  const { switchChain } = useSwitchChain()

  return useMutation<unknown, Error, { chainId: number }>(
    async ({ chainId }) => {
      if (chainId) {
        await switchChain({ chainId: chainId });
        return true
      }
      return null


    },
  );
}


/**
 * If chainId is not passed it returns all tokens from all chains
 * @param param0
 * @returns
 */
export function useAllTokenList({
  chainId,
  includeNative = false,
  onlyTradable,
  onlyNative,
  isWizardConfig,
}: {
  chainId?: number;
  includeNative?: boolean;
  onlyNative?: boolean;
  onlyTradable?: boolean;
  isWizardConfig?: boolean;
}) {
  const appConfig = useAppConfig();
  const { wizardConfig } = useAppWizardConfig();

  const tokensValues = useAtomValue(tokensAtom) || [];

  const tokenListJson = useMemo(() => {
    if (isWizardConfig && wizardConfig && wizardConfig.tokens?.length === 1) {
      return wizardConfig.tokens[0].tokens || [];
    }

    if (appConfig.tokens?.length === 1) {
      return appConfig.tokens[0].tokens || [];
    }

    return [];
  }, [appConfig, isWizardConfig, wizardConfig]);

  // TODO: do the right logic
  let tokens = [...tokensValues, ...tokenListJson];

  if (onlyTradable) {
    tokens = tokens.filter((t) => Boolean(t.tradable));
  }

  return useMemo(() => {
    if (onlyNative && chainId) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: getNativeCurrencyImage(chainId),
          name: getNativeCurrencySymbol(chainId),
          symbol: getNativeCurrencySymbol(chainId),
        },
      ] as Token[];
    }
    let tokenList: Token[] = [...tokens];
    if (chainId) {
      tokenList = [
        ...tokens.filter((token: Token) => token.chainId === chainId),
      ];
    }

    if (chainId) {
      const wrappedAddress = NETWORKS[chainId]?.wrappedAddress;
      const isNoWrappedTokenInList =
        tokenList &&
        tokenList.findIndex(
          (t) => t.address.toLowerCase() === wrappedAddress,
        ) === -1;
      // Wrapped Token is not on the list, we will add it here
      if (wrappedAddress && isNoWrappedTokenInList) {
        tokenList = [
          {
            address: wrappedAddress,
            chainId,
            decimals: 18,
            logoURI: getNativeCurrencyImage(chainId),
            name: `Wrapped ${getNativeCurrencySymbol(chainId)}`,
            symbol: `W${getNativeCurrencySymbol(chainId)}`,
          } as Token,
          ...tokenList,
        ];
      }
    } else {
      // if no chainId, we just add all networks
      for (const ch of Object.keys(NETWORKS)) {
        const chain = Number(ch);
        const wrappedAddress = NETWORKS[chain]?.wrappedAddress;
        const isNoWrappedTokenInList =
          tokenList &&
          tokenList.findIndex(
            (t) => t.address.toLowerCase() === wrappedAddress,
          ) === -1;
        // Wrapped Token is not on the list, we will add it here
        if (wrappedAddress && isNoWrappedTokenInList) {
          tokenList = [
            {
              address: wrappedAddress,
              chainId: chain,
              decimals: 18,
              logoURI: getNativeCurrencyImage(chain),
              name: `Wrapped ${getNativeCurrencySymbol(chain)}`,
              symbol: `W${getNativeCurrencySymbol(chain)}`,
            } as Token,
            ...tokenList,
          ];
        }
      }
    }
    if (includeNative && chainId) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: getNativeCurrencyImage(chainId),
          name: getNativeCurrencySymbol(chainId),
          symbol: getNativeCurrencySymbol(chainId),
        },
        ...tokenList,
      ] as Token[];
    } else {
      for (const ch of Object.keys(NETWORKS)) {
        const chain = Number(ch);
        tokenList = [
          {
            address: ZEROEX_NATIVE_TOKEN_ADDRESS,
            chainId: chain,
            decimals: 18,
            logoURI: getNativeCurrencyImage(chain),
            name: getNativeCurrencySymbol(chain),
            symbol: getNativeCurrencySymbol(chain),
          },
          ...tokenList,
        ] as Token[];
      }
    }

    return [...tokenList] as Token[];
  }, [chainId, onlyNative, includeNative]);
}



export function useNetworkProvider(chainId?: ChainId) {
  return getProviderByChainId(chainId);
}


