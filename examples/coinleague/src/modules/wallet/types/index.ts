import { MagicLoginType } from '@/modules/common/connectors/magic';
import { TokenBalances } from '@indexed-finance/multicall';
import { AccountType, CoinTypes, WalletConnectType } from '../constants/enums';

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

export type Account = {
  type: AccountType;
  loginType?: MagicLoginType;
  connector?: WalletConnectType;
  address: string;
  name?: string;
  walletIndex?: number;
  walletId?: string;
};

export type Wallet = {
  id: string;
  name: string;
  accounts?: Account[];
};

export interface AccountBalance {
  network: BlockchainNetwork;
  address: string;
  balances: TokenBalances;
}

export type CoinPrices = {
  [key: number]: { [key: string]: { [key: string]: number } };
};

export type CoinGeckoMarketDataItem = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: any;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: string;
    currency: string;
    percentage: number;
  };
  last_updated: string;
  price_change_percentage_24h_in_currency: number;
};

export type CoinGeckoMarketsData = { [key: string]: CoinGeckoMarketDataItem };

export type Coins = { [key: string]: Coin };

export type EvmTokenList = {
  name: string;
  icon?: string;
  url: string;
};
