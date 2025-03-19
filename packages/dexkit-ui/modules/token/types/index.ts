import { OrderMarketType } from "@dexkit/exchange/constants";

export interface MarketTradeConfig {
  showTokenDetails?: boolean;
  useGasless?: boolean;
  show?: OrderMarketType;
  baseTokenConfig?: {
    chainId?: number;
    address?: string;
  };
  slippage?: number;
}
