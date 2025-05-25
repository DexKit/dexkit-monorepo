import { AppNotificationType } from "../../types";

export const COMMON_NOTIFICATION_TYPES: { [key: string]: AppNotificationType } =
{
  approve: {
    type: "approve",
    message: "Approve {name} ({symbol}) to trade",
    id: "approve.name.symbol.to.trade",
    color: "primary.light",
    icon: "check",
  },
  approveSpender: {
    type: "approveSpender",
    message: "Allow {spender} to spend {quantity} {name} ({symbol}) on your behalf",
    id: "approve.spender.quantity.on.your.behalf",
    color: "primary.light",
    icon: "check",
  },
  revokeSpender: {
    type: "revokeSpender",
    message: "Revoke {spender} to spend {name} ({symbol}) on your behalf",
    id: "revoke.spender.quantity.on.your.behalf",
    color: "primary.light",
    icon: "check",
  },
  approveForAll: {
    type: "approveForAll",
    message: "Approve {name} ({tokenId}) to trade",
    id: "approve.name.tokenId.to.trade",
    icon: "check",
  },
  unwrap: {
    type: "unwrap",
    message: "Unwrap {amount} ({symbol})",
    id: "unwrap.amount.symbol",
    icon: "check",
  },
  wrap: {
    type: "wrap",
    message: "Unwrap {amount} ({symbol})",
    id: "wrap.amount.symbol",
    icon: "check",
  },
  swap: {
    type: "swap",
    color: "primary.light",
    message:
      "Swap {sellAmount} {sellTokenSymbol} for {buyAmount} {buyTokenSymbol}",
    id: "swap.sellamount.symbol.for.buyamount.symbol",
    icon: "swap_vert",
  },
  transfer: {
    type: "transfer",
    message: "Send {amount} {symbol} to {address}",
    id: "send.amount.symbol.to.address",
    icon: "shortcut",
  },
  nftTransfer: {
    type: "nftTransfer",
    message: "Transfer {name} #{id}",
    id: "transfer.name.id",
    icon: "shortcut",
  },
  nftEditionTransfer: {
    type: "nftEditionTransfer",
    message: "Transfer {quantity} of {name} to {address}",
    id: "transfer.quantity.of.name.id",
    icon: "shortcut",
  },


  tokenOrder: {
    type: "tokenOrder",
    message: "Cancel order",
    id: "cancel.token.order",
    icon: "shortcut",
  },
  nftBurn: {
    type: "nftBurn",
    message: "Burn {name} #{id}",
    id: "burn.name.id",
    icon: "shortcut",
  },
  burnToken: {
    type: "burnToken",
    message: "Burn {name} {quantity} {symbol}",
    id: "burn.name.quantity",
    icon: "shortcut",
  },
  mintToken: {
    type: "mintToken",
    message: "Mint {quantity} {symbol} to {to}",
    id: "mint.name.quantity",
    icon: "shortcut",
  },
  nftBurnMultiple: {
    type: "nftBurnMultiple",
    message: "Burn {quantity} of {name} #{id}",
    id: "burn.multiple.name.id",
    icon: "shortcut",
  },
  claimRewards: {
    type: "claimRewards",
    message: "Claim {amount} of {name}",
    id: "claim.rewards.amount.name",
    icon: "shortcut",
  },
  stakeToken: {
    type: "stakeToken",
    message: "Stake {amount} on {name}",
    id: "stake.amount.on.name",
    icon: "shortcut",
  },
  unstakeToken: {
    type: "unstakeToken",
    message: "Unstake {amount} on {name}",
    id: "unstake.amount.on.name",
    icon: "shortcut",
  },
  stakeNfts: {
    type: "stakeNfts",
    message: "Stake {nfts} on {name}",
    id: "stake.nfts.nfts.on.name",
    icon: "shortcut",
  },
  unstakeNfts: {
    type: "unstakeNfts",
    message: 'Unstake "{nfts}" from {name}',
    id: "unstake.nfts.nfts.on.name",
    icon: "shortcut",
  },
  stakeEdition: {
    type: "stakeEdition",
    message: "Stake {amount} of #{nft} on {name}",
    id: "stake.nfts.nfts.on.name",
    icon: "shortcut",
  },
  unstakeEdition: {
    type: "unstakeEdition",
    message: "Unstake {amount} of #{nft} on {name}",
    id: "unstake.amount.of.nfts.on.name",
    icon: "shortcut",
  },
  claimEditionRewards: {
    type: "claimEditionRewards",
    message: "Claim rewards of #{nft} on {name}",
    id: "claim.rewards.of.nft.on.name",
    icon: "shortcut",
  },
  updateMetadata: {
    type: "updateMetadata",
    message: "Update metadata for {contractName}",
    id: "update.metadata.for.contractname",
    icon: "shortcut",
  },
  updateContractRoles: {
    type: "updateContractRoles",
    message: "Update roles for {contractName}",
    id: "update.roles.for.contractName",
    icon: "shortcut",
  },
  withdrawRewards: {
    type: "withdrawRewards",
    message: "Withdraw rewards ({amount}) from {contractName}",
    id: "withdraw.rewards.amount.from.contractName",
    icon: "shortcut",
  },
  depositRewards: {
    type: "depositRewards",
    message: "Deposit {amount} {symbol} rewards for {contractName}",
    id: "deposit.rewards.amount.for.contractName",
    icon: "shortcut",
  },
  depositRewardTokens: {
    type: "depositRewardTokens",
    message: "Deposit rewards ({amount}) for {contractName}",
    id: "deposit.rewards.amount.for.contractName",
    icon: "shortcut",
  },
  setRewardPerUnitTime: {
    type: "setRewardPerUnitTime",
    message: "Set reward per unit time to {amount} for {contractName}",
    id: "set.reward.per.unit.time.to.amount.for.contractName",
    icon: "shortcut",
  },
  setDefaultTimeUnit: {
    type: "setDefaultTimeUnit",
    message: "Set time unit to {amount} for {contractName}",
    id: "Set.time.unit.to.amount.for.contractName",
    icon: "shortcut",
  },
  setRewardRatio: {
    id: "set.reward.ratio.to.numerator.denominator.for.contractName",
    type: "setRewardRatio",
    message:
      "Set reward ratio to {numerator}/{denominator} for {contractName}",
    icon: "shortcut",
  },
  approveContracForAllNfts: {
    type: "approveContracForAllNfts",
    message: "Approve {name} to trade",
    id: "approve.name.to.trade",
    icon: "check",
  },
  airdropErc20: {
    type: "airdropErc20",
    message: "Airdrop {amount} of {name}",
    id: "airdrop.amount.of.name",
    icon: "shortcut",
  },
  airdropErc721: {
    type: "airdropErc721",
    message: "Airdrop of {name}",
    id: "airdrop.of.name",
  },
  airdropErc1155: {
    type: "airdropErc1155",
    message: "Airdrop of {name}",
    id: "airdrop.of.name",
  },
  purchaseKey: {
    type: "purchaseKey",
    message: "Purchase key from lock {name} for {price} {currency}",
    id: "purchase.key.name",
    icon: 'key',
  },
  renewKey: {
    type: "renewKey",
    message: "Renew key from lock {name} for {price} {currency} for {durationInDays}",
    id: "purchase.key.name",
    icon: 'autorenew'
  },
  claimAirdropERC20: {
    type: "claimAirdropERC20",
    message: "Claim airdrop of {name}",
    id: "claim.airdrop.of.name",
  },

};




export const WHITELABEL_NOTIFICATION_TYPES: {
  [key: string]: AppNotificationType;
} = {
  acceptOffer: {
    type: 'acceptOffer',
    message:
      'Accept offer of {amount} {symbol} for the asset {collectionName} #{id}',
    id: 'accept.offer.transaction.title',
    icon: 'check',
  },
  buyNft: {
    type: 'buyNft',
    message: 'Buy {collectionName} #{id} for {amount} {symbol}',
    id: 'buy.asset.transaction.title',
    icon: 'local_mall',
  },
  createListing: {
    type: 'createListing',
    message: 'Create listing for {collectionName} #{id}',
    id: 'create.listing.for.collectionName.id',
    icon: 'list',
  },
  cancelOffer: {
    type: 'cancelOffer',
    message: 'Cancel offer for the asset {collectionName} #{id}',
    id: 'cancel.offer.for.asset.collectionName.id',
    icon: 'cancel',
  },
  cancelListing: {
    type: 'cancelOrder',
    message: 'Cancel listing for the asset {collectionName} #{id}',
    id: 'cancel.order',

    icon: 'cancel',
  },
  claimAirdrop: {
    type: 'claimAirdrop',
    message: 'Claimed KIT airdrop',
    id: 'claim.airdrop',
  },
  mintEditionDrop: {
    type: 'mintEditionDrop',
    message: 'Minting {quantity} with id {tokenId} from edition {name}',
    id: 'mint.edition.drop.notification.message',
    icon: 'gavel',
  },
  mintNFTDrop: {
    type: 'mintNFTDrop',
    message: 'Minting {quantity} from collection drop {name}',
    id: 'mint.collection.drop.notification.message',
    icon: 'gavel',
  },
  mintTokenDrop: {
    type: 'mintTokenDrop',
    message: 'Minting {quantity} from token drop {name}',
    id: 'mint.token.drop.notification.message',
    icon: 'gavel',
  },
};
