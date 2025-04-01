import { NETWORKS } from "@dexkit/core/constants/networks";
import { Token } from "@dexkit/core/types";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { isAddress } from "@dexkit/core/utils/ethers/isAddress";

import type { BigNumber } from "ethers";

// import { MagicConnector } from "../connectors/magic";

export function isAddressEqual(address?: string, other?: string) {
  if (address === undefined || other === undefined) {
    return false;
  }

  if (!isAddress(address) || !isAddress(other)) {
    return false;
  }

  return address.toLowerCase() === other.toLowerCase();
}

export function formatBigNumber(val: BigNumber, decimals: number) {
  // TODO: improve this code in the future
  // pass to a memoized component or something
  const value = formatUnits(val, decimals);

  let index = value.indexOf(".");

  if (val.isZero()) {
    return value;
  }

  while (true) {
    index = index + 1;

    if (value.at(index) !== "0") {
      break;
    }
  }

  let ending = index;

  while (true) {
    ending = ending + 1;

    if (ending === value.length - 1 || ending === index + 4) {
      break;
    }
  }

  return value.substring(0, ending);
}

export function parseChainId(chainId: string | number) {
  return typeof chainId === "number"
    ? chainId
    : Number.parseInt(chainId, chainId.startsWith("0x") ? 16 : 10);
}

export function tokenKey(token: Token) {
  return `${token.chainId}-${token.address.toLowerCase()}`;
}

export function getBlockExplorerUrl(chainId?: number) {
  if (chainId) {
    return NETWORKS[chainId].explorerUrl;
  }
}
