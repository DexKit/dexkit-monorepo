import type { providers } from "ethers";
import { BigNumber } from "ethers";
import { useAsyncMemo } from "../../../hooks";
import { SUPPORTED_SWAP_CHAIN_IDS } from "../constants/supportedChainIds";
import { ExecType, SwapSide } from "../types";

import { WRAPPED_TOKEN_ADDRESS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";
import { isNativeInSell } from "@dexkit/ui/modules/swap/utils";
import { isAddressEqual } from "../../../utils";

export function useExecType({
  chainId,
  connectedChainId,
  lazyBuyToken,
  lazySellToken,
  account,
  quoteQuery,
  quoteFor,
  isGasless,
  lazySellAmount,
  provider,
}: {
  chainId?: number;
  connectedChainId?: number;
  lazyBuyToken?: Token;
  lazySellToken?: Token;
  isGasless?: boolean;
  quoteFor?: SwapSide;
  lazySellAmount?: BigNumber;
  provider?: providers.BaseProvider;
  account?: string;
  quoteQuery: any;
}) {
  return useAsyncMemo<ExecType>(
    async (initial) => {
      let result: ExecType = initial;
      if (connectedChainId && chainId && chainId !== connectedChainId) {
        return "switch";
      }

      if (
        chainId &&
        !SUPPORTED_SWAP_CHAIN_IDS.includes(chainId as unknown as number)
      ) {
        return "network_not_supported";
      }

      const isBuyTokenWrapped =
        lazyBuyToken &&
        chainId &&
        isAddressEqual(WRAPPED_TOKEN_ADDRESS(chainId), lazyBuyToken.address);

      const isSellTokenWrapped =
        lazySellToken &&
        chainId &&
        isAddressEqual(WRAPPED_TOKEN_ADDRESS(chainId), lazySellToken.address);

      // Gasless not work on native token as sell side
      const canGasless =
        isGasless &&
        lazySellToken &&
        quoteFor &&
        lazyBuyToken &&
        !isNativeInSell({
          sellToken: lazySellToken,
          buyToken: lazyBuyToken,
          side: quoteFor,
        });

      if (
        lazyBuyToken &&
        lazySellToken &&
        quoteQuery.data &&
        !isBuyTokenWrapped &&
        !isSellTokenWrapped &&
        account
      ) {
        return canGasless ? "swap_gasless" : "swap";
      }

      result =
        isBuyTokenWrapped &&
        isAddressEqual(lazySellToken?.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? "wrap"
          : isSellTokenWrapped &&
            isAddressEqual(lazyBuyToken?.address, ZEROEX_NATIVE_TOKEN_ADDRESS)
          ? "unwrap"
          : canGasless
          ? "swap_gasless"
          : "swap";

      return result;
    },
    "quote",
    [
      provider,
      connectedChainId,
      lazyBuyToken,
      lazySellToken,
      quoteQuery.data,
      account,
      lazySellAmount,
      chainId,
      quoteFor,
      isGasless,
    ]
  );
}
