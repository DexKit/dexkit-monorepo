import { ChainId } from "@dexkit/core";

export enum OrderMarketType {
  "buy" = "buy",
  "sell" = "sell",
  "buyAndSell" = "buyAndSell",
}

export const ORDER_LIMIT_DURATIONS: {
  messageId: string;
  defaultMessage: string;
  value: number;
}[] = [
  { messageId: "five.minutes", defaultMessage: "5 minutes", value: 5 * 60 },
  { messageId: "ten.minutes", defaultMessage: "10 minutes", value: 10 * 60 },
  { messageId: "one.hour", defaultMessage: "1 hour", value: 60 * 60 },
  { messageId: "two.hours", defaultMessage: "2 hours", value: 2 * 60 * 60 },
  {
    messageId: "twenty.four.hours",
    defaultMessage: "24 hours",
    value: 24 * 60 * 60,
  },
];

export const GECKOTERMINAL_NETWORK: { [key: number]: string } = {
  [ChainId.Ethereum]: "eth",
  [ChainId.Polygon]: "polygon_pos",
  [ChainId.Arbitrum]: "arbitrum",
  [ChainId.BSC]: "bsc",
  [ChainId.Avax]: "avax",
  [ChainId.Celo]: "celo",
  [ChainId.Fantom]: "ftm",
  [ChainId.Optimism]: "optimism",
  [ChainId.Base]: "base",
};

export const GET_GECKOTERMINAL_NETWORK = (chainId?: ChainId) => {
  if (!chainId) {
    return;
  }

  return GECKOTERMINAL_NETWORK[chainId];
};

export const DEFAULT_ZRX_NETWORKS = [
  ChainId.Ethereum,
  ChainId.BSC,
  ChainId.Polygon,
];
