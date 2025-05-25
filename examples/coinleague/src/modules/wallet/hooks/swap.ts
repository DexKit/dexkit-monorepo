import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { EVM_NETWORKS, ZERO_EX_QUOTE_ENDPOINT } from '../constants';

import { NEXT_PUBLIC_DEXKIT_API_URL } from '@/modules/common/constants';
import { ChainId } from '@/modules/common/constants/enums';
import { DkApiCoin, DkApiPlatformCoin } from '@/modules/common/types/api';
import { coinsAtom } from '../atoms/index';
import { Networks } from '../constants/enums';
import { Quote, Token } from '../types/swap';

export function useDebounce<T>(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSwapTokens(chainId?: ChainId) {
  const [tokens] = useAtom(coinsAtom);

  return useMemo(() => {
    if (!chainId || !tokens) {
      return [];
    }
    return tokens.filter((c) =>
      EVM_NETWORKS.includes(c.network.id as Networks)
    );
  }, [tokens, chainId]);
}

export function useSwapQuote({
  chainId,
  buyToken,
  sellToken,
  buyAmount,
  sellAmount,
  takerAddress,
  skipValidation = true,
  feeRecipient,
  buyTokenPercentageFee,
  onSuccess,
  maxSlippage,
}: {
  chainId?: number;
  buyToken?: Token;
  sellToken?: Token;
  buyAmount: string;
  sellAmount: string;
  skipValidation?: boolean;
  takerAddress?: string;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
  maxSlippage?: number;
  onSuccess?: (quote?: Quote) => void;
}) {
  return useQuery<Quote, Error>(
    ['SWAP_TOKENS', chainId, buyToken, sellToken, buyAmount, sellAmount],
    async () => {
      if (
        (buyToken === undefined && sellToken === undefined) ||
        (buyAmount === undefined && sellAmount === undefined) ||
        (buyAmount === '' && sellAmount === '')
      ) {
        return null;
      }
      console.log(chainId);

      return await axios
        .get(ZERO_EX_QUOTE_ENDPOINT(chainId), {
          timeout: 20000,
          params: {
            buyToken: buyToken?.address.toLowerCase(),
            sellToken: sellToken?.address.toLowerCase(),
            buyAmount:
              buyAmount !== ''
                ? ethers.utils
                  .parseUnits(buyAmount, buyToken?.decimals)
                  .toString()
                : undefined,
            sellAmount:
              sellAmount !== ''
                ? ethers.utils
                  .parseUnits(sellAmount, sellToken?.decimals)
                  .toString()
                : undefined,
            takerAddress,
            skipValidation,
            buyTokenPercentageFee,
            feeRecipient,
            slippagePercentage: maxSlippage ? String(maxSlippage) : undefined,
          },
        })
        .then((resp) => resp.data)
        .catch((err) => {
          if (err.response.status === 400) {
            if (err.response.data.validationErrors) {
              if (err.response.data.validationErrors.length > 0) {
                const firstError = err.response.data.validationErrors[0];
                if (firstError.reason === 'INSUFFICIENT_ASSET_LIQUIDITY') {
                  throw new Error('Insufficient liquidity');
                }
              }
            }
          }

          throw err;
        });
    },
    {
      onSuccess,
      enabled:
        buyToken !== undefined &&
        sellToken !== undefined &&
        (sellAmount !== '' || buyAmount !== ''),
      refetchInterval: 5000,
    }
  );
}

export function useExecSwap(
  onSuccess?: (hash: string) => void,
  options?: Omit<UseMutationOptions, any>
) {
  const { provider } = useWeb3React();

  return useMutation(async (quote?: Quote) => {
    if (!quote || !provider) {
      throw new Error('Needs to pass valid quote');
    }

    const tx = await provider.getSigner().sendTransaction({
      data: quote?.data,
      gasPrice: ethers.BigNumber.from(quote?.gasPrice),
      value: ethers.BigNumber.from(quote?.value),
      to: quote?.to,
    });
    if (onSuccess) {
      onSuccess!(tx.hash);
    }
    const receipt = await tx.wait();

    return receipt.status === 1 && receipt.confirmations >= 1;
  }, options);
}

export const COIN_PLATFORM_SEARCH_QUERY = 'COIN_PLATFORM_SEARCH_QUERY';

export function usePlatformCoinSearch({
  keyword,
  network,
}: {
  keyword?: string;
  network?: string;
}) {
  return useQuery(
    [COIN_PLATFORM_SEARCH_QUERY, keyword, network],
    async ({ signal }) => {
      const req = await axios.get<DkApiPlatformCoin[]>(
        `${NEXT_PUBLIC_DEXKIT_API_URL}/coin/search-platforms`,
        { signal, params: { keyword, network } }
      );

      return req.data;
    },
    { suspense: true }
  );
}

export const COIN_SEARCH_QUERY = 'COIN_SEARCH_QUERY';

export function useCoinSearch({
  keyword,
  network,
}: {
  keyword?: string;
  network?: string;
}) {
  return useQuery([COIN_SEARCH_QUERY, keyword, network], async ({ signal }) => {
    const req = await axios.get<DkApiCoin[]>(
      `${NEXT_PUBLIC_DEXKIT_API_URL}/coin/search`,
      { signal, params: { keyword, network } }
    );

    return req.data;
  });
}
