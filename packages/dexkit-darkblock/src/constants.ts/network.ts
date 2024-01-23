export enum ChainId {
  ethereum = 1,
  eth_goerli = 5,
  polygon = 137,
  pulse = 369,
  base = 8543,
  polygon_mumbai = 80001,
  avalanche = 43114,
  avalanche_fuji = 43113,
  base_goerli = 84531,
  base_sepolia = 84532
}




export const DARKBLOCK_EVM_NETWORKS: { [key: number]: string } = {
  [ChainId.ethereum]: 'Ethereum',
  [ChainId.eth_goerli]: 'Ethereum-Goerli',
  [ChainId.polygon]: 'Polygon',
  [ChainId.pulse]: 'Pulse',
  [ChainId.base]: 'Base',
  [ChainId.polygon_mumbai]: 'Polygon-Mumbai',
  [ChainId.avalanche]: 'Avalanche',
  [ChainId.avalanche_fuji]: 'Avalanche-Fuji',
  [ChainId.base_goerli]: 'Base-Goerli',
  [ChainId.base_sepolia]: 'Base-Sepolia'
}

