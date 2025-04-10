import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/ui/modules/swap/constants";

/**
 * Gasless swaps don't work with native token
 * @param param0
 * @returns
 */
export function isNativeInSell({
  side,
  sellToken,
  buyToken,
}: {
  side: "buy" | "sell";
  sellToken: { address: string };
  buyToken: { address: string };
}) {
  if (
    side === "buy" &&
    buyToken &&
    buyToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS
  ) {
    return true;
  }

  if (
    side === "sell" &&
    sellToken &&
    sellToken.address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS
  ) {
    return true;
  }

  return false;
}

export const getSwapFeeTokenAddress = ({
  sellTokenAddress,
  buyTokenAddress,
}: {
  sellTokenAddress?: string;
  buyTokenAddress?: string;
}): string => {
  if (!sellTokenAddress || !buyTokenAddress) {
    return ZEROEX_NATIVE_TOKEN_ADDRESS;
  }

  if (sellTokenAddress.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS) {
    return sellTokenAddress;
  }

  return buyTokenAddress;
};
