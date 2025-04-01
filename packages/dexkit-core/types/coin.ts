import { CoinTypes } from "../constants";

export type BlockchainNetwork = {
  id: string;
  name: string;
  chainId?: number;
  icon?: string;
  coingeckoPlatformId?: string;
};

export interface NetworkCoin {
  network: BlockchainNetwork;
  coinType: CoinTypes;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl?: string;
  isHidden?: boolean;
  isFavorite?: boolean;
  coingeckoId?: string;
}

export interface NativeEvmCoin extends NetworkCoin {
  coinType: CoinTypes.EVM_NATIVE;
}

export interface Erc20Coin extends NetworkCoin {
  coinType: CoinTypes.EVM_ERC20;
  contractAddress: string;
}

export type EvmCoin = NativeEvmCoin | Erc20Coin;

export interface SolanaNativeCoin extends NetworkCoin {
  coinType: CoinTypes.SOLANA_NATIVE;
}

export interface BitcoinNativeCoin extends NetworkCoin {
  coinType: CoinTypes.BITCOIN_NATIVE;
}

export type Coin = EvmCoin | SolanaNativeCoin | BitcoinNativeCoin;
