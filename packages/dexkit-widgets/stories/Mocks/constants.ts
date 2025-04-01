import { ChainId, CoinTypes } from "@dexkit/core/constants";
import { Coin } from "@dexkit/core/types";
import { Nft, NftMetadata } from "@dexkit/core/types/nft";

export const POLYGON_COIN: Coin = {
  network: {
    id: "polygon",
    name: "Polygon",
    chainId: ChainId.Polygon,
  },
  coinType: CoinTypes.EVM_NATIVE,
  decimals: 18,
  name: "Polygon",
  symbol: "Matic",
  coingeckoId: "matic-network",
};

export const POLYGON_USDT_TOKEN: Coin = {
  network: {
    id: "polygon",
    name: "Polygon",
    chainId: ChainId.Polygon,
  },
  coinType: CoinTypes.EVM_ERC20,
  contractAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  decimals: 6,
  name: "Tether",
  symbol: "USDT",
  coingeckoId: "tether",
};

export const Account = {
  address: "0x5bD68B4d6f90Bcc9F3a9456791c0Db5A43df676d",
};

export const ENSAccount = {
  address: "vitalik.eth",
};

export const NFT: Nft = {
  owner: Account.address,
  tokenId: "1",
  symbol: "Kitty",
  collectionName: "Kittygotchi",
  contractAddress: "0xEA88540adb1664999524d1a698cb84F6C922D2A1",
  tokenURI: "https://kittygotchi.dexkit.com/api/1",
  chainId: ChainId.Polygon,
};

export const NFTMetadata: NftMetadata = {
  name: "Kittygotchi",
  image: "ipfs://QmZux8HgHokv5NR4MwRRytj1UPQ76WMPQ4deUTjeA8nkgs",
  description:
    "Your cute Kitty, make it unique, feed him to earn attack, speed, and defense, he is here for you. Your Kitty gives you special powers on DexKit Dashboard",
  attributes: [
    { trait_type: "Clothes", value: "Love date" },
    { trait_type: "Eyes", value: "Eyeliner" },
    { trait_type: "Mouth", value: "Happy" },
    { trait_type: "Nose", value: "Pug-nose" },
    { trait_type: "Ears", value: "Fun" },
    { trait_type: "Body", value: "Body" },
    { trait_type: "Accessories", value: "Headphones" },
    { trait_type: "Attack", value: 114 },
    { trait_type: "Defense", value: 114 },
    { trait_type: "Run", value: 125 },
  ],
};
