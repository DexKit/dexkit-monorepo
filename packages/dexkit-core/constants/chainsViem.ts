import type { Chain } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  fantom,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonAmoy,
  polygonMumbai,
  pulsechain,
  sepolia,
} from "viem/chains";

const chainsViem = [
  mainnet,
  goerli,
  optimism,
  bsc,
  bscTestnet,
  polygon,
  fantom,
  pulsechain,
  base,
  arbitrum,
  avalanche,
  polygonMumbai,
  polygonAmoy,
  blast,
  sepolia,
  blastSepolia,
] as [Chain, ...Chain[]];

export { chainsViem };
