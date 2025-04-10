import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";

import { ChainId, TransactionStatus, TransactionType } from "@dexkit/core/constants/enums";
import { useMutation, useQuery } from "@tanstack/react-query";

import { WRAPPED_TOKEN_ADDRESS } from "@dexkit/core/constants/networks";
import { Token, TransactionMetadata } from "@dexkit/core/types";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import { client } from "@dexkit/wallet-connectors/thirdweb/client";

import { useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { defineChain, getContract, getGasPrice, prepareContractCall, resolveMethod, sendTransaction } from "thirdweb";
import { Account, getWalletBalance } from "thirdweb/wallets";
import {
  isConnectWalletOpenAtom,
  recentTokensAtom,
  transactionDialogErrorAtom,
  transactionDialogHashAtom,
  transactionDialogMetadataAtom,
  transactionDialogOpenAtom,
  transactionDialogRedirectUrlAtom,
  transactionTypeAtom,
  transactionValuesAtom,
  transactionsAtom
} from '../state/atoms';
import { isAddressEqual, tokenKey } from "../utils";
import { NotificationCallbackParams } from "../widgets/swap/types";
import { convertOldTokenToNew } from "../widgets/swap/utils";

export { useCoinPrices } from './useCoinPrices';

export function useConnectWalletDialog() {
  const [isOpen, setOpen] = useAtom(isConnectWalletOpenAtom);

  return {
    isOpen,
    setOpen,
  };
}

export function useBlockNumber() {
  const { provider } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (provider) {
      const handleBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };

      provider?.on("block", handleBlockNumber);

      return () => {
        provider?.removeListener("block", handleBlockNumber);
      };
    }
  }, [provider]);

  return blockNumber;
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

export function useDebounceCallback<T>(
  value: T,
  callback: (value: T) => void,
  delay: number
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
}

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  return isMounted;
}

export interface WrapTokenParams {
  amount: bigint;
  onHash: (hash: string) => void;
  chainId?: number,
  activeAccount?: Account
}

export function useWrapToken({
  onNotification,
}: {
  onNotification: (params: NotificationCallbackParams) => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const wrapMutation = useMutation(
    async ({ amount, onHash, chainId, activeAccount }: WrapTokenParams) => {
      if (!chainId || !activeAccount) {
        throw new Error("no chainId");
      }



      const contractAddress = WRAPPED_TOKEN_ADDRESS(chainId) || '';

      const contract = getContract({
        client,
        address: contractAddress,
        chain: defineChain(chainId),
      });

      const transaction = await prepareContractCall({
        contract,
        method: resolveMethod('deposit'),
        params: [amount]
      })

      const { transactionHash } = await sendTransaction({
        account: activeAccount,
        transaction,
      })



      onHash(transactionHash);

      return true;
    },
    {
      onError: (err: any) => {
        if (err.message) {
          enqueueSnackbar(err.message, { variant: "error" });
        } else {
          enqueueSnackbar(String(err), { variant: "error" });
        }
      },
    }
  );

  const unwrapMutation = useMutation(
    async ({ activeAccount, chainId, amount, onHash }: WrapTokenParams) => {
      if (!chainId || !activeAccount) {
        throw new Error("no chainId");
      }



      const contractAddress = WRAPPED_TOKEN_ADDRESS(chainId) || '';

      const contract = getContract({
        client,
        address: contractAddress,
        chain: defineChain(chainId),
      });

      const transaction = await prepareContractCall({
        contract,
        method: resolveMethod('widthdraw'),
        params: [amount]
      })

      const { transactionHash } = await sendTransaction({
        account: activeAccount,
        transaction,
      })

      onHash(transactionHash);

      return true;
    },
    {
      onError: (err: any) => {
        if (err.message) {
          enqueueSnackbar(err.message, { variant: "error" });
        } else {
          enqueueSnackbar(String(err), { variant: "error" });
        }
      },
    }
  );

  return { wrapMutation, unwrapMutation };
}

export function useAsyncMemo<T>(
  cb: (initial: T) => Promise<T>,
  initial: T,
  args: unknown[]
) {
  const [result, setResult] = useState<T>(initial);

  useEffect(() => {
    async function load() {
      const res = await cb(result);
      if (!active) {
        return;
      }
      setResult(res);
    }

    let active = true;
    load();
    return () => {
      active = false;
    };
  }, args);

  return result;
}

export const TOKEN_BALANCE = "TOKEN_BALANCE";

export interface TokenBalanceParams {
  account?: string;
  contractAddress?: string;
  chainId?: number
}

export function useTokenBalance({
  account,
  contractAddress,
  chainId

}: TokenBalanceParams) {
  return useQuery([TOKEN_BALANCE, account, contractAddress], async () => {
    if (!contractAddress || !account || !chainId) {
      return BigInt(0);
    }

    if (isAddressEqual(contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
      return (await getWalletBalance({
        address: account,
        client,
        chain: defineChain(chainId),

      })).value as bigint;



    }

    return (await getWalletBalance({
      address: account,
      client,
      chain: defineChain(chainId),
      tokenAddress: contractAddress,
    })).value as bigint;
  });
}



export const COIN_PRICES_QUERY = "COIN_PRICES_QUERY";





export const GAS_PRICE_QUERY = "";

export function useGasPrice({
  chainId,
}: {
  chainId?: number;
}) {
  return useQuery(
    [GAS_PRICE_QUERY],
    async () => {
      if (chainId) {
        return await getGasPrice({ client, chain: defineChain(chainId) });
      }

      return BigInt(0);
    },
    { refetchInterval: 20000 }
  );
}


export function useTransactionDialog() {
  const updateTransactions = useUpdateAtom(transactionsAtom);

  const [isOpen, setDialogIsOpen] = useAtom(transactionDialogOpenAtom);
  const [hash, setHash] = useAtom(transactionDialogHashAtom);
  const [error, setError] = useAtom(transactionDialogErrorAtom);
  const [metadata, setMetadata] = useAtom(transactionDialogMetadataAtom);
  const [type, setType] = useAtom(transactionTypeAtom);

  const [values, setValues] = useAtom(transactionValuesAtom);

  const [redirectUrl, setRedirectUrl] = useAtom(
    transactionDialogRedirectUrlAtom
  );

  const { chainId } = useWeb3React();

  const watch = useCallback((hash: string) => {
    setHash(hash);
  }, []);

  const open = useCallback((type: string, values: Record<string, any>) => {
    setDialogIsOpen(true);
    setValues(values);
    setType(type);
  }, []);

  const close = useCallback(() => {
    setDialogIsOpen(false);
    setType(undefined);
    setValues(undefined);
  }, []);

  const showDialog = useCallback(
    (open: boolean, metadata?: TransactionMetadata, type?: TransactionType) => {
      setDialogIsOpen(open);
      setMetadata(metadata);

      if (!open) {
        setHash(undefined);
        setMetadata(undefined);
        setType(undefined);
      }
    },
    []
  );

  const setDialogError = useCallback(
    (error?: Error) => {
      if (isOpen) {
        setError(error);
      }
    },
    [setError, isOpen]
  );

  const addTransaction = useCallback(
    (hash: string, type: TransactionType, metadata?: TransactionMetadata) => {
      if (chainId !== undefined) {
        setHash(hash);

        updateTransactions((txs) => ({
          ...txs,
          [hash]: {
            chainId,
            created: new Date().getTime(),
            status: TransactionStatus.Pending,
            type,
            metadata,
            checked: false,
          },
        }));
      }
    },
    [chainId]
  );

  return {
    values,
    open,
    close,
    redirectUrl,
    setRedirectUrl,
    error,
    hash,
    metadata,
    type,
    setHash,
    isOpen,
    setDialogIsOpen,
    setError,
    setMetadata,
    setType,
    showDialog,
    setDialogError,
    addTransaction,
    watch,
  };
}

export function useRecentTokens() {
  const [recentTokens, setRecentTokens] = useAtom(recentTokensAtom);

  const add = useCallback((token: Token) => {
    setRecentTokens((recentTokens) => {
      let copyRecentTokens = [...recentTokens];
      let recentToken = recentTokens.map(v => {
        return {
          count: v.count,
          token: convertOldTokenToNew(v.token) as Token
        }
      })
        .find(
          (r) => tokenKey(r.token) === tokenKey(token)
        );

      if (recentToken) {
        recentToken.count = recentToken.count + 1;
      } else {
        copyRecentTokens.push({ token, count: 1 });
      }

      return copyRecentTokens;
    });
  }, []);

  const clear = useCallback((chainId?: ChainId) => {
    setRecentTokens((coins) => {
      if (chainId) {
        return [...coins.filter((t) => t.token.chainId !== chainId)];
      }

      return [];
    });
  }, []);

  const tokens = useMemo(() => {
    return recentTokens
      .sort((a, b) => {
        if (a.count > b.count) {
          return -1;
        } else if (a.count < b.count) {
          return 1;
        }

        return 0;
      })
      .map((t) => convertOldTokenToNew(t.token) as Token)
      .slice(0, 5);
  }, [recentTokens]);

  return {
    tokens,
    add,
    clear,
  };
}