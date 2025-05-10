import {
  UserEvents,
  UserOnChainEvents,
} from "@dexkit/core/constants/userEvents";

export const USER_EVENT_NAMES: Record<
  string,
  { id: string; defaultMessage: string }
> = {
  [UserOnChainEvents.swap]: {
    id: "swap",
    defaultMessage: "Swap",
  },
  [UserOnChainEvents.transfer]: {
    id: "transfer",
    defaultMessage: "Transfer",
  },
  [UserOnChainEvents.nftAcceptListERC1155]: {
    id: "accept.nft.listing.erc1155",
    defaultMessage: "Accept NFT Listing ERC1155",
  },
  [UserOnChainEvents.nftAcceptOfferERC721]: {
    id: "accepted.offers.erc721",
    defaultMessage: "Accepted Offers ERC721",
  },
  [UserOnChainEvents.buyDropCollection]: {
    id: "buy.collection.drop",
    defaultMessage: "Buy Collection Drops",
  },
  [UserOnChainEvents.buyDropEdition]: {
    id: "buy.edition.drop",
    defaultMessage: "Buy Edition Drops",
  },
  [UserOnChainEvents.buyDropToken]: {
    id: "buy.token.drop",
    defaultMessage: "Buy Token Drops",
  },
  [UserOnChainEvents.deployContract]: {
    id: "contract.deployment",
    defaultMessage: "Contract deployment",
  },
  [UserOnChainEvents.nftAcceptListERC721]: {
    defaultMessage: "Accept NFT List ERC721",
    id: "accept.nft.list.erc721",
  },
  [UserOnChainEvents.nftAcceptOfferERC1155]: {
    defaultMessage: "Accept NFT Offer ERC1155",
    id: "accept.nft.offer.erc1155",
  },
  [UserOnChainEvents.marketSell]: {
    defaultMessage: "Market Sell Orders",
    id: "market.sell.orders",
  },
  [UserOnChainEvents.marketBuy]: {
    defaultMessage: "Market Buy Orders",
    id: "market.buy.orders",
  },
  [UserOnChainEvents.purchaseKey]: {
    defaultMessage: "Unlock Purchase Keys",
    id: "unlock.purchase.keys",
  },
  [UserOnChainEvents.renewKey]: {
    defaultMessage: "Unlock Renew Keys",
    id: "unlock.renew.keys",
  },
  [UserOnChainEvents.stakeErc20]: {
    defaultMessage: "Stake Token",
    id: "stake.erc20",
  },
  [UserOnChainEvents.unstakeErc20]: {
    defaultMessage: "Unstake Token",
    id: "unstake.erc20",
  },
  [UserOnChainEvents.stakeClaimErc20]: {
    defaultMessage: "Claim Token Rewards",
    id: "claim.token.rewards",
  },

  [UserOnChainEvents.stakeClaimErc721]: {
    defaultMessage: "Claim Collection Rewards",
    id: "claim.collection.rewards",
  },

  [UserOnChainEvents.stakeClaimErc1155]: {
    defaultMessage: "Claim Edition Rewards",
    id: "claim.edition.rewards",
  },

  [UserOnChainEvents.stakeErc721]: {
    defaultMessage: "Stake Collection",
    id: "stake.erc721",
  },
  [UserOnChainEvents.unstakeErc721]: {
    defaultMessage: "Unstake Collection",
    id: "unstake.erc721",
  },
  [UserOnChainEvents.stakeErc1155]: {
    defaultMessage: "Stake Edition",
    id: "stake.erc721",
  },
  [UserOnChainEvents.unstakeErc1155]: {
    defaultMessage: "Unstake Edition",
    id: "unstake.erc1155",
  },
  [UserOnChainEvents.orderCancelled]: {
    defaultMessage: "Cancelled Orders",
    id: "cancelled.orders",
  },
};

export const USER_OFFCHAIN_EVENT_NAMES: Record<
  string,
  { id: string; defaultMessage: string }
> = {
  [UserEvents.connectAccount]: {
    defaultMessage: "Account Connected",
    id: "account.connected",
  },
  [UserEvents.loginSignMessage]: {
    defaultMessage: "Account Login",
    id: "account.login",
  },
  [UserEvents.postLimitOrder]: {
    defaultMessage: "Post Limit Order",
    id: "post.limit.order",
  },
  [UserEvents.nftERC721List]: {
    defaultMessage: "Collection Listings",
    id: "collection.listings",
  },
  [UserEvents.nftERC721Offer]: {
    defaultMessage: "Collection Offers",
    id: "collection.offers",
  },
  [UserEvents.nftERC1155List]: {
    defaultMessage: "Edition Listings",
    id: "edition.listings",
  },
  [UserEvents.nftERC1155Offer]: {
    defaultMessage: "Edition Offers",
    id: "edition.offers",
  },
};
