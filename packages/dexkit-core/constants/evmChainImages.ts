import { ChainId } from "./enums";
export const UNKNOWN_LOGO_URL = "https://raw.githubusercontent.com/DexKit/assets/main/networks/unknown-logo.png";


export function GET_EVM_CHAIN_IMAGE({ chainId }: { chainId: number }) {

  return EVM_CHAIN_IMAGES[chainId]?.imageUrl

}

export function GET_EVM_CHAIN_ICON({ chainId, allChains }: { chainId: number, allChains: { icon?: string, chainId: number }[] }) {

  if (chainId === 25) {
    return 'https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/refs/heads/main/assets/evm-chain-icons/cronos.png'
  }

  if (chainId === 534352) {
    return 'https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/refs/heads/main/assets/evm-chain-icons/scroll.png'
  }

  // zkSync Mainnet
  if (chainId === 324) {
    return 'https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/refs/heads/main/assets/evm-chain-icons/zksync.png'
  }

  // Polygon zkEVM
  if (chainId === 1101) {
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygonzkevm/info/logo.png'
  }

  // SEI Network
  if (chainId === 1329) {
    return 'https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/refs/heads/main/assets/evm-chain-icons/sei.png'
  }

  const chainIndex = allChains.findIndex(n => n.chainId == chainId);
  return allChains[chainIndex]?.icon ? `https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/refs/heads/main/assets/evm-chain-icons/${allChains[chainIndex]?.icon}.png` : undefined;
}

export const EVM_CHAIN_IMAGES: { [key: number]: { imageUrl?: string, coinImageUrl?: string, icon?: string } } =
{

  [ChainId.Ethereum]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",

  },
  [ChainId.Optimism]: {

    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",

  },
  [ChainId.BSC]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
  },
  [ChainId.Polygon]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  },
  [ChainId.Arbitrum]: {

    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",

  },

  [ChainId.Avax]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
  },
  [ChainId.Base]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",

  },

  [ChainId.Goerli]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",

  },
  [ChainId.Mumbai]: {
    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  },

  [ChainId.BlastSepolia]: {
    imageUrl:
      "https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/main/assets/evm-chain-icons/blast.png",
    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  },
  [ChainId.Blast]: {
    imageUrl:
      "https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/main/assets/evm-chain-icons/blast.png",
    coinImageUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  },
  [ChainId.Sepolia]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",

  },

  [ChainId.Pulse]: {

    imageUrl:
      "https://raw.githubusercontent.com/DexKit/dexkit-evm-chains/main/assets/evm-chain-icons/pulse.svg",

  },

}