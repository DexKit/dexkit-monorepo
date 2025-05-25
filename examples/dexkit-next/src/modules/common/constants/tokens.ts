import { Token } from '../types/transactions';
import { ChainId } from './enums';

const DEXKIT_ETH: Token = {
  address: '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
  chainId: ChainId.Ethereum,
  name: 'DexKit',
  symbol: 'KIT',
  decimals: 18,
  logoURI: '',
};

const DEXKIT_BINANCE: Token = {
  address: '0x314593fa9a2fa16432913dbccc96104541d32d11',
  chainId: ChainId.BSC,
  name: 'DexKit',
  symbol: 'KIT',
  decimals: 18,
  logoURI: '',
};

const DEXKIT_MATIC: Token = {
  address: '0x4d0def42cf57d6f27cd4983042a55dce1c9f853c',
  chainId: ChainId.Polygon,
  name: 'DexKit',
  symbol: 'KIT',
  decimals: 18,
  logoURI: '',
};

const DEXKIT_MUMBAI: Token = {
  address: '0xdf2e4383363609351637d262f6963D385b387340',
  chainId: ChainId.Mumbai,
  name: 'DexKit',
  symbol: 'KIT',
  decimals: 18,
  logoURI: '',
};

// a list of tokens by chain
type DexKitTokenList = {
  readonly [chainId in ChainId]: Token;
};

export const DEXKIT: Partial<DexKitTokenList> = {
  [ChainId.Ethereum]: DEXKIT_ETH,
  [ChainId.BSC]: DEXKIT_BINANCE,
  [ChainId.Polygon]: DEXKIT_MATIC,
  [ChainId.Mumbai]: DEXKIT_MUMBAI,
};
