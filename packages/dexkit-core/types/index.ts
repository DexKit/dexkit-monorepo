export type * from "./blockchain";
export type * from "./coin";
export type * from "./nft";

// import { Dispatch, SetStateAction } from "react";

// Define types locally to avoid import issues
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
import type { ChainId, TransactionStatus, TransactionType } from "../constants";
import type { TransactionMetadata } from "./blockchain";

export type TokenWhitelabelApp = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: ChainId;
  logoURI: string;
  tradable?: boolean;
  disableFeatured?: boolean;
};

export type Token = {
  chainId: ChainId;
  address: string;
  name: string;
  symbol: string;
  coingeckoId?: string;
  decimals: number;
  /**
   * @deprecated
   */
  isWrapped?: boolean;
  logoURI?: string;
};



export type TokenPrices = {
  [key: number]: { [key: string]: { [key: string]: number } };
};

export type Network = {
  chainId: ChainId;
  name: string;
  symbol: string;
  coinName?: string;
  coinSymbol?: string;
  coinImageUrl?: string;
  coingeckoPlatformId?: string;
  imageUrl?: string;
  testnet?: boolean;
  explorerUrl?: string;
  wrappedAddress?: string;
  slug?: string;
  providerRpcUrl?: string;
};



export interface AppTransaction {
  title?: string;
  status: TransactionStatus;
  created: number;
  chainId: ChainId;
  checkedBlockNumber?: number;
  type?: TransactionType;
  values: Record<string, any>;
}

export interface WatchTransactionDialogProperties {
  values: Record<string, any> | undefined;
  open: (type: string, values: Record<string, any>) => void;
  close: () => void;
  redirectUrl: string | undefined;
  setRedirectUrl: (update?: SetStateAction<string | undefined>) => void;
  error: Error | undefined;
  hash: string | undefined;
  metadata: TransactionMetadata | undefined;
  type: string | undefined;
  isOpen: boolean;
  setHash: Dispatch<SetStateAction<string | undefined>>;
  setType: Dispatch<SetStateAction<string | undefined>>;
  setDialogIsOpen: (update: SetStateAction<boolean>) => void;
  setError: (update?: SetStateAction<Error | undefined>) => void;
  setMetadata: (
    update?: SetStateAction<TransactionMetadata | undefined>
  ) => void;
  showDialog: (
    open: boolean,
    metadata?: TransactionMetadata,
    type?: TransactionType
  ) => void;
  setDialogError: (error?: Error) => void;
  addTransaction: ({
    hash,
    type,
    metadata,
    values,
  }: {
    hash: string;
    type: TransactionType;
    metadata?: TransactionMetadata | undefined;
    values: Record<string, any>;
    chainId: ChainId;
  }) => void;
  watch: (hash: string) => void;
}

export interface DexkitApiProviderState {
  // instance: AxiosInstance | null;
  instance: any;
}
