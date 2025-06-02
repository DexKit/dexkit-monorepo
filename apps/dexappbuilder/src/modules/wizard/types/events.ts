import { ChainId } from '@dexkit/core';

export type SwapUserEvent = {
  txHash: string;
  from: string;
  chainId: ChainId;
  tokenIn: {
    decimals: number;
    name: string;
    symbol: string;
    address: string;
  };
  tokenInAmount: string;
  tokenOut: {
    decimals: number;
    name: string;
    symbol: string;
    address: string;
  };
  tokenOutAmount: string;
};

export type TransferUserEvent = {
  amount: string;
  chainId: number;
  txHash: string;
  to: string;
  from: string;
  token: { symbol: string };
};

export type NftAcceptListERC1155UserEvent = {
  token: {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
  };
  tokenId: string;
  tokenAmount: string;
  collection: {
    address: string;
    tokenId: string;
  };
  nftAmount: string;
};
