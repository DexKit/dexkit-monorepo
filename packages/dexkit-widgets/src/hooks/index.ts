import { useWeb3React, Web3ReactHooks } from "@web3-react/core";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Connector } from "@web3-react/types";
import { BigNumber, ethers, providers } from "ethers";
import { useAtom, useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import {
  currencyAtom,
  recentTokensAtom,
  showTransactionsAtom,
  transactionsAtom,
  walletConnectorAtom,
} from "../components/atoms";
import { metaMask } from "../connectors";
import { MagicLoginType } from "../connectors/magic";
import { CONNECTORS, WRAPED_TOKEN_ADDRESS } from "../constants";
import { ERC20Abi, WETHAbi } from "../constants/abis";
import { ChainId } from "../constants/enum";
import { getPricesByChain, getTokensBalance } from "../services";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "../services/zeroex/constants";
import { Token, Transaction } from "../types";
import { isAddressEqual, tokenKey } from "../utils";
import { NotificationCallbackParams } from "../widgets/swap/types";

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

export function useTransactions() {
  const [isOpen, setOpen] = useAtom(showTransactionsAtom);

  const updateTransactions = useUpdateAtom(transactionsAtom);

  const addTransaction = useCallback(
    ({ transaction }: { transaction: Transaction }) => {
      if (transaction) {
        updateTransactions((txs: { [key: string]: Transaction }) => {
          const copyTxs = { ...txs };

          copyTxs[transaction.hash] = transaction;

          return copyTxs;
        });
      }
    },
    [updateTransactions]
  );

  return { isOpen, setOpen, addTransaction };
}

export function useOrderedConnectors() {
  const selectedWallet = useAtomValue(walletConnectorAtom);

  return useMemo(() => {
    let connectors: [Connector, Web3ReactHooks][] = [];

    if (selectedWallet) {
      const otherConnectors = Object.keys(CONNECTORS)
        .filter((key) => selectedWallet !== key)
        .map((key) => CONNECTORS[key]);

      connectors = [CONNECTORS[selectedWallet], ...otherConnectors];
    } else {
      const otherConnectors = Object.keys(CONNECTORS).map(
        (key) => CONNECTORS[key]
      );

      connectors = otherConnectors;
    }

    return connectors;
  }, [selectedWallet]);
}

export function useWalletActivate() {
  const { connector } = useWeb3React();

  const setWalletConnector = useUpdateAtom(walletConnectorAtom);

  return useMutation(
    async ({
      connectorName,
      loginType,
      email,
    }: {
      connectorName: string;
      loginType?: MagicLoginType;
      email?: string;
    }) => {
      if (connector.deactivate) {
        await connector.deactivate();
      }
      if (connectorName === "metamask") {
        setWalletConnector("metamask");
        return await metaMask.connector.activate();
      } else if (connectorName === "magic") {
        // setWalletConnector("magic");
        // return await magic.activate({
        //   loginType,
        //   email,
        // });
      }
    }
  );
}

export function useCurrency() {
  return useAtomValue(currencyAtom);
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
  provider?: providers.Web3Provider;
  amount: BigNumber;
  onHash: (hash: string) => void;
}

export function useWrapToken({
  onNotification,
}: {
  onNotification: (params: NotificationCallbackParams) => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const wrapMutation = useMutation(
    async ({ provider, amount, onHash }: WrapTokenParams) => {
      if (!provider) {
        throw new Error("no provider");
      }

      const chainId = (await provider?.getNetwork()).chainId;

      const contractAddress = WRAPED_TOKEN_ADDRESS[chainId];

      const contract = new ethers.Contract(
        contractAddress,
        WETHAbi,
        provider.getSigner()
      );

      const tx = await contract.deposit({ value: amount });

      // onNotification({
      //   chainId,
      //   title: formatMessage(
      //     { id: "wrap.symbol", defaultMessage: "Wrap {symbol}" },
      //     { symbol: NETWORKS[chainId].symbol }
      //   ),
      //   hash: tx.hash,
      //   params: {},
      // });

      onHash(tx.hash);

      return (await tx.wait()) as ethers.providers.TransactionReceipt;
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
    async ({ provider, amount, onHash }: WrapTokenParams) => {
      if (!provider) {
        throw new Error("no provider");
      }

      const chainId = (await provider?.getNetwork()).chainId;

      const contract = new ethers.Contract(
        WRAPED_TOKEN_ADDRESS[chainId],
        ["function withdraw(uint wad) public "],
        provider.getSigner()
      );

      const tx = await contract.withdraw(amount);

      // onNotification({
      //   chainId,
      //   title: formatMessage(
      //     { id: "wrap.symbol", defaultMessage: "Unwrap {symbol}" },
      //     { symbol: NETWORKS[chainId].symbol }
      //   ),
      //   hash: tx.hash,
      // });

      onHash(tx.hash);

      return (await tx.wait()) as ethers.providers.TransactionReceipt;
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
  provider?: ethers.providers.BaseProvider;
}

export function useTokenBalance({
  account,
  contractAddress,
  provider,
}: TokenBalanceParams) {
  return useQuery([TOKEN_BALANCE, account, contractAddress], async () => {
    if (!contractAddress || !provider || !account) {
      return BigNumber.from(0);
    }

    if (isAddressEqual(contractAddress, ZEROEX_NATIVE_TOKEN_ADDRESS)) {
      return await provider.getBalance(account);
    }

    const contract = new ethers.Contract(contractAddress, ERC20Abi, provider);

    return (await contract.balanceOf(account)) as BigNumber;
  });
}

export const MULTI_TOKEN_BALANCE_QUERY = "MULTI_TOKEN_BALANCE_QUERY";

export function useMultiTokenBalance({
  tokens,
  account,
  provider,
}: {
  account?: string;
  tokens?: Token[];
  provider?: ethers.providers.BaseProvider;
}) {
  const enabled = Boolean(tokens && provider && account);

  return useQuery(
    [MULTI_TOKEN_BALANCE_QUERY, tokens, account],
    async () => {
      if (!tokens || !provider || !account) {
        return;
      }

      return await getTokensBalance(tokens, provider, account);
    },
    { enabled: enabled }
  );
}

export const COIN_PRICES_QUERY = "";

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

export function useRecentTokens() {
  const [recentTokens, setRecentTokens] = useAtom(recentTokensAtom);

  const add = useCallback((token: Token) => {
    setRecentTokens((recentTokens) => {
      let copyRecentTokens = [...recentTokens];
      let recentToken = recentTokens.find(
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
      .map((t) => t.token)
      .slice(0, 5);
  }, [recentTokens]);

  return {
    tokens,
    add,
    clear,
  };
}

export const GAS_PRICE_QUERY = "";

export function useGasPrice({
  provider,
}: {
  provider?: ethers.providers.BaseProvider;
}) {
  return useQuery(
    [GAS_PRICE_QUERY],
    async () => {
      if (provider) {
        return await provider.getGasPrice();
      }

      return BigNumber.from(0);
    },
    { refetchInterval: 20000 }
  );
}
