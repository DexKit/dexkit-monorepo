export enum ChainId {
  Ethereum = 1,
  Ropsten = 3,
  Cronos = 25,
  BSC = 56,
  BSCTest = 97,
  Polygon = 137,
  Avax = 43114,
  Mumbai = 80001,
  Optimism = 10,
  Base = 8453,
  Arbitrum = 42161,
  Celo = 42220,
  Goerli = 5,
  BlastSepolia = 168587773,
  Blast = 81457,
  Sepolia = 11155111,
  Pulse = 369,
  Mode = 34443,
  Mantle = 5000,
  Linea = 59144,
  Scroll = 534352,
}

export enum TransactionStatus {
  Pending,
  Failed,
  Confirmed,
}

export enum CoinTypes {
  EVM_NATIVE = "evm-native",
  EVM_ERC20 = "evm-erc20",
  BITCOIN_NATIVE = "bitcoin",
  SOLANA_NATIVE = "solana-native",
}

export enum TransactionType {
  APPROVE,
  APPROVAL_FOR_ALL,
  WRAP,
  BUY,
  ACCEPT,
  CANCEL,
  MAKE_OFFER,
  SWAP,
}
