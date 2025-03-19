export enum EIP6963Event {
  REQUEST_PROVIDER = "eip6963:requestProvider",
  ANNOUNCE_PROVIDER = "eip6963:announceProvider",
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}
