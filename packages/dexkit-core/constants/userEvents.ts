export enum UserOnChainEvents {
  approve = "approve",
  swap = "swap",
  deployContract = "deployContract",
  unwrap = "unwrap",
  wrap = "wrap",
  transfer = "transfer",
  receive = "receive",
  stakeErc20 = "stakeErc20",
  unstakeErc20 = "unstakeErc20",
  stakeClaimErc20 = "stakeClaimErc20",

  stakeErc721 = "stakeErc721",
  unstakeErc721 = "unstakeErc721",
  stakeClaimErc721 = "stakeClaimErc721",

  stakeErc1155 = "stakeErc1155",
  unstakeErc1155 = "unstakeErc1155",
  stakeClaimErc1155 = "stakeClaimErc1155",

  buyDropEdition = "buyDropEdition",
  buyDropCollection = "buyDropCollection",
  buyDropToken = "buyDropToken",
  claimAirdropERC20 = "claimAirdropERC20",
  nftTransferERC721 = "nftTransferERC721",
  nftAcceptOfferERC721 = "nftAcceptOfferERC721",
  nftAcceptListERC721 = "nftAcceptListERC721",
  nftAcceptOfferERC1155 = "nftAcceptOfferERC1155",
  nftAcceptListERC1155 = "nftAcceptListERC1155",
  nftTransferERC1155 = "nftTransferERC1155",
  nftBurnERC721 = "nftBurnERC721",
  nftBurnERC1155 = "nftBurnERC1155",
  nftBurnMultiple = "nftBurnMultiple",
  marketBuy = "marketBuy",
  marketSell = "marketSell",
  orderCancelled = "orderCancelled",
  purchaseKey = "purchaseKey",
  renewKey = "renewKey",
  cancelNFTERC721order = "cancelNFTERC721Order",
  cancelNFTERC1155order = "cancelNFTERC1155Order",
}

export enum UserOffChainEvents {
  signMessage = "signMessage",
  swapGasless = "swapGasless",
  marketBuyGasless = "marketBuyGasless",
  marketSellGasless = "marketSellGasless",
  loginSignMessage = "loginSignMessage",
  connectAccount = "connectAccount",
  disconnectAccount = "disconnectAccount",
  postLimitOrder = "postLimitOrder",
  nftERC1155List = "nftERC1155List",
  nftERC1155Offer = "nftERC1155Offer",
  nftERC721List = "nftERC721List",
  nftERC721Offer = "nftERC721Offer",
}

export type UserEventsType = UserOnChainEvents | UserOffChainEvents;

export const UserEvents = {
  ...UserOnChainEvents,
  ...UserOffChainEvents,
};
