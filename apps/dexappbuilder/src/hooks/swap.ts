import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
  NotificationCallbackParams,
  RenderOptions,
} from '@dexkit/widgets/src/widgets/swap/types';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ZERO_EX_QUOTE_ENDPOINT } from '../constants';

import { ChainId } from '@dexkit/core';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { parseUnits } from '@dexkit/core/utils/ethers/parseUnits';
import { useDexKitContext } from '@dexkit/ui/hooks';
import {
  isAutoSlippageAtom,
  maxSlippageAtom,
  tokensAtom,
} from '../state/atoms';
import { Quote, Token } from '../types/blockchain';
import { useAppConfig, useConnectWalletDialog } from './app';

export function useSwapState() {
  const { chainId } = useWeb3React();
  const [isAutoSlippage, setIsAutoSlippage] = useAtom(isAutoSlippageAtom);
  const [maxSlippage, setMaxSlippage] = useAtom(maxSlippageAtom);

  const appConfig = useAppConfig();

  const onChangeSlippage = useCallback((value: number) => {
    setMaxSlippage(value);
  }, []);

  const onAutoSlippage = useCallback((value: boolean) => {
    setIsAutoSlippage((value) => !value);
  }, []);

  const config = useAppConfig();

  const featuredTokens = useMemo(() => {
    return config.tokens
      ?.map((t) => t.tokens)
      .flat()
      .map((t) => {
        return {
          chainId: t.chainId as number,
          address: t.address,
          decimals: t.decimals,
          name: t.name,
          symbol: t.symbol,
          logoURI: t.logoURI,
        };
      });
  }, [config]);

  const renderOptions = useMemo(() => {
    return {
      disableFooter: true,
      disableNotificationsButton: true,
      configsByChain: {},
      featuredTokens,
      currency: 'usd',
      defaultChainId: chainId || ChainId.Ethereum,
      zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || '',
      transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || '',
    } as RenderOptions;
  }, [featuredTokens, chainId]);

  const { createNotification } = useDexKitContext();

  const onNotification = useCallback(
    ({ title, hash, chainId, params }: NotificationCallbackParams) => {
      if (params.type === 'swap') {
        createNotification({
          type: 'transaction',
          subtype: 'swap',
          icon: 'swap_vert',
          values: {
            sellTokenSymbol: params.sellToken.symbol.toUpperCase(),
            sellAmount: formatUnits(
              params.sellAmount,
              params.sellToken.decimals
            ),
            buyTokenSymbol: params.buyToken.symbol.toUpperCase(),
            buyAmount: formatUnits(
              params.buyAmount,
              params.buyToken.decimals
            ),
          },
          metadata: {
            hash,
            chainId,
          },
        });
      } else if (params.type === 'approve') {
        createNotification({
          type: 'transaction',
          subtype: 'approve',
          icon: 'check_circle',
          values: {
            symbol: params.token.symbol.toUpperCase(),
            name: params.token.name,
          },
          metadata: {
            hash,
            chainId,
          },
        });
      }
    },
    []
  );

  const connectWalletDialog = useConnectWalletDialog();

  const onConnectWallet = useCallback(() => {
    connectWalletDialog.setOpen(true);
  }, []);

  const onShowTransactions = useCallback(() => {
    // do nothing
  }, []);

  return {
    renderOptions,
    maxSlippage,
    isAutoSlippage,
    onChangeSlippage,
    onAutoSlippage,
    onNotification,
    onConnectWallet,
    onShowTransactions,
    swapFees: appConfig.swapFees,
  };
}

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
  const [tokens] = useAtom(tokensAtom);
  return useMemo(() => {
    if (!chainId || !tokens) {
      return [];
    }
    return tokens.filter((t) => t.chainId === (chainId as number));
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
        return;
      }

      return await axios
        .get(ZERO_EX_QUOTE_ENDPOINT(chainId), {
          timeout: 20000,
          params: {
            buyToken: buyToken?.address.toLowerCase(),
            sellToken: sellToken?.address.toLowerCase(),
            buyAmount:
              buyAmount !== ''
                ? parseUnits(buyAmount, buyToken?.decimals)
                  .toString()
                : undefined,
            sellAmount:
              sellAmount !== ''
                ? parseUnits(sellAmount, sellToken?.decimals)
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
          if (err?.response?.data?.reason) {
            throw new Error(err.response.data.reason);
          }
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
      gasPrice: BigNumber.from(quote?.gasPrice),
      value: BigNumber.from(quote?.value),
      to: quote?.to,
    });
    if (onSuccess) {
      onSuccess!(tx.hash);
    }
    const receipt = await tx.wait();

    return receipt.status === 1 && receipt.confirmations >= 1;
  }, options);
}
