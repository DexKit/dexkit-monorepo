import { ChainId } from "@dexkit/core/constants/enums";
import { TransactionStatus } from "../constants/enum";

export type Network = {
  chainId: ChainId;
  name: string;
  symbol: string;
  coingeckoPlatformId?: string;
  imageUrl?: string;
  testnet?: boolean;
  explorerUrl?: string;
  wrappedAddress?: string;
  slug?: string;
  providerRpcUrl?: string;
};

export type TokenPrices = {
  [key: number]: { [key: string]: { [key: string]: number } };
};

export interface Transaction {
  hash: string;
  icon?: string;
  checked?: boolean;
  title?: string;
  status: TransactionStatus;
  created: number;
  chainId: ChainId;
}

export type AppState = {
  transactions: { [key: string]: Transaction };
};
