import { ChainId } from "@dexkit/core";
import { SUPPORTED_UNISWAP_V2 } from "@dexkit/ui/modules/swap/constants";

export enum OrderMarketType {
  'buy' = 'buy',
  'sell' = 'sell',
  'buyAndSell' = 'buyAndSell'
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
  [ChainId.Optimism]: "optimism",
  [ChainId.BSC]: "bsc",
  [ChainId.Polygon]: "polygon_pos",
  [ChainId.Base]: "base",
  [ChainId.Arbitrum]: "arbitrum",
  [ChainId.Avax]: "avax",
  [ChainId.Blast]: "blast",
  [ChainId.Linea]: "linea",
  [ChainId.Scroll]: "scroll",
  [ChainId.Mantle]: "mantle",
  [ChainId.Mode]: "mode",
  [ChainId.Cronos]: "cro",
};

export const GET_GECKOTERMINAL_NETWORK = (chainId?: ChainId) => {
  if (!chainId) {
    return;
  }

  return GECKOTERMINAL_NETWORK[chainId];
};

export const ZEROX_SUPPORTED_NETWORKS = [
  ChainId.Ethereum,
  ChainId.Optimism,
  ChainId.BSC,
  ChainId.Polygon,
  ChainId.Base,
  ChainId.Arbitrum,
  ChainId.Avax,
  ChainId.Linea,
  ChainId.Scroll,
  ChainId.Mantle,
  ChainId.Blast,
  ChainId.Mode,
];

export const DEFAULT_ZRX_NETWORKS = ZEROX_SUPPORTED_NETWORKS;

export const EXCHANGE_SUPPORTED_NETWORKS = [...ZEROX_SUPPORTED_NETWORKS, ...SUPPORTED_UNISWAP_V2]
