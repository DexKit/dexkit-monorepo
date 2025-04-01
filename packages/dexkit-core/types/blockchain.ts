import type { BigNumber } from "ethers";
import { TransactionStatus, TransactionType } from "../constants";
import { Token } from "../types";

import { Asset, SwapApiOrder } from "./nft";

export interface SwapTransactionMetadata {
  sellToken: Token;
  buyToken: Token;
  sellAmount: BigNumber;
  buyAmount: BigNumber;
}

export interface ApproveTransactionMetadata {
  amount: string;
  symbol: string;
  name?: string;
  decimals?: number;
}

export interface ApproveForAllTransactionMetadata {
  asset: Asset;
}

export interface CancelTransactionMetadata {
  asset: Asset;
  order: SwapApiOrder;
}

export interface AcceptTransactionMetadata {
  asset: Asset;
  order: SwapApiOrder;
  tokenDecimals: number;
  symbol: string;
}

export interface BuyTransactionMetadata {
  asset: Asset;
  order: SwapApiOrder;
  tokenDecimals: number;
  symbol: string;
}

export interface MintEditionDropTransactionMetadata {
  quantity: string;
  tokenId: string;
  name?: string;
  address?: string;
}

export type TransactionMetadata =
  | SwapTransactionMetadata
  | ApproveTransactionMetadata
  | CancelTransactionMetadata
  | AcceptTransactionMetadata
  | BuyTransactionMetadata
  | ApproveForAllTransactionMetadata
  | MintEditionDropTransactionMetadata;

export interface Transaction {
  title?: string;
  status: TransactionStatus;
  type: TransactionType;
  created: number;
  chainId: number;
  checkedBlockNumber?: number;
  metadata?: TransactionMetadata;
  checked?: boolean;
}
