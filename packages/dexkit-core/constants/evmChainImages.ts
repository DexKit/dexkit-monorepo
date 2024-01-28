import { ChainId } from "./enums";

export const UNKNOWN_LOGO_URL = "https://raw.githubusercontent.com/DexKit/assets/main/networks/unknown-logo.png";

export const EVM_CHAIN_IMAGES: { [key: number]: { imageUrl?: string, coinImageUrl?: string } } =
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
  [ChainId.Fantom]: {

    imageUrl:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png",

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

}