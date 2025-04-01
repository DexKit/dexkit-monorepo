export const THIRDWEB_CONTRACTTYPE_TO_NAME: { [key: string]: string } = {
  DropERC20: "Token Drop",
  DropAllowanceERC20: "Token Drop",
  DropERC721: "NFT Drop",
  DropERC1155: "Edition Drop",
  MarketplaceV3: "Marketplace",
  Multiwrap: "Multiwrap",
  NFTStake: "NFT Stake",
  TokenStake: "Token Stake",
  EditionStake: "Edition Stake",
  Pack: "Pack",
  SignatureDrop: "Signature Drop",
  Split: "Split",
  TokenERC1155: "Edition",
  TokenERC20: "Token",
  TokenERC721: "NFT",
  VoteERC20: "Token Vote",
  AirdropERC20: "Token Airdrop",
  AirdropERC721: "NFT Airdrop",
  AirdropERC1155: "Edition Airdrop",
  Custom: "Custom",
};

export const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  ? process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  : "8b875cba6d295240d3b3861a3e8c2260";
