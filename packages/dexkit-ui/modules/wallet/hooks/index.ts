import { ChainId, CoinTypes } from "@dexkit/core/constants/enums";
import { formatEther } from "@dexkit/core/utils/ethers/formatEther";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useQuery } from "@tanstack/react-query";
import { ParseOutput, parse } from "eth-url-parser";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { useMemo } from "react";
import { useEvmCoins, useTokenList } from "../../../hooks/blockchain";
import { getERC20Balances } from "../../../services/balances";
import { isBalancesVisibleAtom } from "../state";
import { TokenBalance } from "../types";

export const GET_ERC20_BALANCES = "GET_ERC20_BALANCES";

type SelectCalback = (data?: TokenBalance[]) => TokenBalance[] | undefined;

export function useIsBalanceVisible() {
  return useAtomValue(isBalancesVisibleAtom);
}

export function useBalanceVisible() {
  return useAtom(isBalancesVisibleAtom);
}

export const useERC20BalancesQuery = (
  select?: SelectCalback,
  defaultChainId?: ChainId,
  enableSuspense = true
) => {
  const {
    provider: walletProvider,
    account,
    chainId: walletChainId,
  } = useWeb3React();
  const chainId = defaultChainId || walletChainId;
  const tokens = useTokenList({ chainId, includeNative: true });
  const { activeAccount } = useWeb3React()

  return useQuery(
    [GET_ERC20_BALANCES, activeAccount, chainId, tokens],
    () => {
      if (
        chainId === undefined ||
        tokens === undefined ||
        activeAccount === undefined
      ) {
        return;
      }
      if (tokens.length === 0) {
        return [];
      }

      return getERC20Balances({ activeAccount, tokens, chainId });
    },
    { enabled: chainId !== undefined, select, suspense: enableSuspense }
  );
};

export function useParsePaymentRequest({
  paymentURL,
}: {
  paymentURL?: string;
}) {
  const paymentUrlParsed = useMemo(() => {
    if (paymentURL) {
      const parsedPayment = parse(paymentURL);
      let url: {
        chainId?: ChainId;
        to?: string;
        parsedOutput?: ParseOutput;
      } = {};
      if (parsedPayment) {
        url.parsedOutput = parsedPayment;
      }

      if (parsedPayment.chain_id) {
        url.chainId = Number(parsedPayment.chain_id);
      }
      if (parsedPayment.function_name === "transfer") {
        if (parsedPayment.parameters && parsedPayment.parameters["address"]) {
          url.to = parsedPayment.parameters["address"];
        }
      } else {
        if (parsedPayment.function_name === undefined) {
          if (parsedPayment.target_address) {
            url.to = parsedPayment.target_address;
          }
        }
      }
      return url;
    }
  }, [paymentURL]);

  const evmCoins = useEvmCoins({ defaultChainId: paymentUrlParsed?.chainId });

  const defaultCoin = useMemo(() => {
    if (paymentUrlParsed?.parsedOutput && evmCoins) {
      let defaultCoin;
      if (paymentUrlParsed.parsedOutput.function_name === "transfer") {
        if (
          paymentUrlParsed.chainId &&
          paymentUrlParsed.parsedOutput.target_address
        ) {
          const contractAddress =
            paymentUrlParsed.parsedOutput.target_address.toLowerCase();
          defaultCoin = evmCoins
            .filter((e) => e.coinType === CoinTypes.EVM_ERC20)
            .find((c) => {
              if (c.coinType === CoinTypes.EVM_ERC20) {
                return (
                  c.contractAddress.toLowerCase() === contractAddress &&
                  paymentUrlParsed.chainId === c.network.chainId
                );
              }
            });
        }
      }
      if (paymentUrlParsed.parsedOutput.function_name === undefined) {
        defaultCoin = evmCoins.find(
          (c) =>
            c.coinType === CoinTypes.EVM_NATIVE &&
            c.network.chainId === paymentUrlParsed.chainId
        );
      }
      return defaultCoin;
    }
  }, [paymentUrlParsed, evmCoins]);
  const amount = useMemo(() => {
    if (defaultCoin && paymentUrlParsed?.parsedOutput) {
      let amount;
      const parsedPayment = paymentUrlParsed?.parsedOutput;

      if (parsedPayment.function_name === "transfer") {
        if (
          parsedPayment.parameters &&
          parsedPayment.parameters["uint256"] &&
          defaultCoin.decimals !== undefined
        ) {
          amount = formatUnits(
            BigInt(parsedPayment.parameters["uint256"]),
            defaultCoin.decimals
          );
        }
      }
      if (parsedPayment.function_name === undefined) {
        if (parsedPayment.parameters && parsedPayment.parameters["value"]) {
          amount = formatEther(BigInt(parsedPayment.parameters["value"]));
        }
      }
      return amount;
    }
  }, [defaultCoin]);
  return {
    ...paymentUrlParsed,
    amount,
    defaultCoin,
  };
}
