import { Transaction } from '@/modules/common/types/transactions';

export enum AppNotificationType {
  Transaction,
}

export interface AppNotificationBase {
  type: AppNotificationType;
  checked: boolean;
  created: number;
  title: string;
  body: string;
  icon: string;
}

export interface TransactionNotification extends AppNotificationBase {
  type: AppNotificationType.Transaction;
  hash: string;
}

export type AppNotification = TransactionNotification;

export type ProfileNft = {
  image: string;
  chainId: number;
  contractAddress: string;
  tokenId: string;
};

export interface AppState {
  transactions: { [hash: string]: Transaction };
  notifications: AppNotification[];
  isBalancesVisible: boolean;
  currency: string;
  locale: string;
  profileNft?: ProfileNft;
}

export interface Currency {
  symbol: string;
  name: string;
}

export interface Language {
  name: string;
  locale: string;
}
