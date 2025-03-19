export enum NFTType {
  ERC1155 = "ERC1155",
  ERC721 = "ERC721",
}

export enum TraderOrderStatus {
  Open = "open",
  Filled = "filled",
  Expired = "expired",
  Cancelled = "cancelled",
  All = "all",
}

export enum SellOrBuy {
  All = "all",
  Sell = "sell",
  Buy = "buy",
}

export enum OrderDirection {
  Sell = 0,
  Buy = 1,
}

export enum CollectionSyncStatus {
  NotSynced = "NotSynced",
  Syncing = "Syncing",
  Synced = "Synced",
  NotSyncable = "NotSyncable",
}
