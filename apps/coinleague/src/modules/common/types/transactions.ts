import { ChainId } from '@/modules/common/constants/enums';
import { BigNumber } from 'ethers';
import { AppNotification } from './app';

export enum TransactionStatus {
  Pending,
  Failed,
  Confirmed,
}

export enum TransactionType {}

export type TransactionMetadata = {};

export interface Transaction {
  title?: string;
  status: TransactionStatus;
  type?: TransactionType;
  created: number;
  chainId: ChainId;
  checkedBlockNumber?: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: ChainId;
  logoURI: string;
}

export interface TokenBalance {
  token: Token;
  balance: BigNumber;
  isProxyUnlocked?: boolean;
}

export interface Quote {
  allowanceTarget: string;
  buyAmount: string;
  buyTokenAddress: string;
  buyTokenToEthRate: string;
  chainId: ChainId;
  data: string;
  estimatedGas: string;
  estimatedPriceImpact: string;
  gas: string;
  gasPrice: string;
  guaranteedPrice: string;
  minimumProtocolFee: string;
  price: string;
  protocolFee: string;
  sellAmount: string;
  sellTokenAddress: string;
  sellTokenToEthRate: string;
  sources: { name: string; proportion: string }[];
  to: string;
  value: string;
}

export interface AddNotificationParams {
  notification: AppNotification;
  transaction?: Transaction;
}
