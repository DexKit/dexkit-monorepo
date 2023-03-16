import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';

import { NotificationCallbackParams } from '@dexkit/widgets/src/widgets/swap/types';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ZERO_EX_QUOTE_ENDPOINT } from '../constants';
import { ChainId } from '../constants/enum';
import {
  isAutoSlippageAtom,
  maxSlippageAtom,
  tokensAtom,
} from '../state/atoms';
import { Quote, Token, TransactionType } from '../types/blockchain';
import { useAppConfig, useConnectWalletDialog, useTransactions } from './app';

export function useSwapState() {
  const [isAutoSlippage, setIsAutoSlippage] = useAtom(isAutoSlippageAtom);
  const [maxSlippage, setMaxSlippage] = useAtom(maxSlippageAtom);

  const appConfig = useAppConfig();

  const { addTransaction } = useTransactions();

  const onChangeSlippage = useCallback((value: number) => {
    setMaxSlippage(value);
  }, []);

  const onAutoSlippage = useCallback(
    (value: boolean) => setIsAutoSlippage(!value),
    []
  );

  const onNotification = useCallback(
    ({ title, hash, chainId, params }: NotificationCallbackParams) => {
      if (params.type === 'swap') {
        addTransaction(hash, TransactionType.SWAP, {
          buyToken: {
            address: params.buyToken.contractAddress,
            chainId: params.buyToken.chainId as number,
            decimals: params.buyToken.decimals,
            logoURI: params.buyToken.logoURI || '',
            name: params.buyToken.name,
            symbol: params.buyToken.symbol,
          },
          sellToken: {
            address: params.sellToken.contractAddress,
            chainId: params.sellToken.chainId as number,
            decimals: params.sellToken.decimals,
            logoURI: params.sellToken.logoURI || '',
            name: params.sellToken.name,
            symbol: params.sellToken.symbol,
          },
          sellAmount: BigNumber.from(params.sellAmount),
          buyAmount: BigNumber.from(params.buyAmount),
        });
      } else if (params.type === 'approve') {
        addTransaction(hash, TransactionType.APPROVE, {
          name: params.token.name,
          symbol: params.token.symbol,
          decimals: params.token.decimals,
          amount: '0',
        });
      }
    },
    [addTransaction]
  );

  const connectWalletDialog = useConnectWalletDialog();

  const onConnectWallet = useCallback(() => {
    connectWalletDialog.setOpen(true);
  }, []);

  const onShowTransactions = useCallback(() => {
    // do nothing
  }, []);

  return {
    isAutoSlippage,
    onChangeSlippage,
    onAutoSlippage,
    onNotification,
    maxSlippage,
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
    return tokens.filter((t) => t.chainId === chainId);
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
