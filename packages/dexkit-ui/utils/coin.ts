import { Token } from "@dexkit/core/types";
import { DkApiPlatformCoin } from "@dexkit/widgets/src/types/api";

export function apiCoinToTokens(coins?: DkApiPlatformCoin[]): Token[] {
  if (!coins) {
    return [];
  }

  return coins.map((c) => ({
    chainId: c.chainId,
    address: c.address,
    decimals: c.decimals,
    name: c.coin?.name ?? "",
    symbol: c.coin?.symbol ?? "",
    coingeckoId: c.platformId,
    logoURI: c.coin?.logoUrl,
  }));
}
