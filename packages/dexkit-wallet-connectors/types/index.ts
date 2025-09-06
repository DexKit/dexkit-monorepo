export enum ConnectionType {
  UNISWAP_WALLET_V2 = 'UNISWAP_WALLET_V2',
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT_V2 = 'WALLET_CONNECT_V2',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
  DEPRECATED_NETWORK = 'DEPRECATED_NETWORK',
  EIP_6963_INJECTED = 'EIP_6963_INJECTED'
}

export enum ConnectionLoginType {
  EMAIL = 'EMAIl',
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD'
}

export interface ProviderInfo {
  name: string
  icon?: string
  rdns?: string
}

