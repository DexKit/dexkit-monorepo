interface WizardItemAttribute {}

export interface CollectionForm {
  name: string;
  symbol: string;
  description: string;
  url: string;
  file: string | null;
  royalty: number;
}

export interface CollectionOwnershipNFTFormType {
  name?: string | null;
  description?: string | null;
  attributes?: {
    trait_type?: string;
    display_type: string;
    value: string;
  }[];
  image?: string | null;
}

export interface ClaimConditionTypeForm {
  startTime: Date | string;
  name: string;
  waitInSeconds: number;
  price: number;
  maxClaimableSupply: number | string;
  maxClaimablePerWallet: number | string;
  merkleRoot?: string;
  currencyAddress: string;
}

export interface CollectionSingleItemFormType {
  name?: string;
  description?: string;
  attributes?: {
    trait_type?: string;
    display_type: string;
    value: string;
  }[];
  file?: string | null;
}

export interface CollectionItemFormType {
  name?: string;
  description?: string;
  attributes?: {
    trait_type?: string;
    display_type: string;
    value: string;
  }[];
  file?: string | null;
  quantity: number;
}

export interface CollectionItemsForm {
  items: CollectionItemFormType[];
}

export interface WizardItem {
  id: string;
  tokenURI: string;
  name: string;
  description: string;
  image: string;
  external_link: string;
  attributes: WizardItemAttribute[];
}

export interface WizardCollection {
  description: string;
  networkId: string;
  image: string;
  external_link: string;
  tx: string;
  address?: string;
}

export interface Erc721Data {
  name: string;
  symbol: string;
  baseUri: string;
}

export enum CollectionSetupSteps {
  Collection,
  Items,
  Deploy,
}

export const DISPLAY_TYPE_BOOST_NUMBER = 'boost_number';
export const DISPLAY_TYPE_BOOST_PERCENTAGE = 'boost_percentage';
export const DISPLAY_TYPE_NUMBER = 'number';

// see https://docs.opensea.io/docs/metadata-standards for more.
export interface CollectionAttribute {
  display_type?: string;
  trait_type: string;
  value: number | string;
}

export interface CollectionItem {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes?: CollectionAttribute[];
}

export interface CollectionItemData {
  id: string;
  image: File | null;
  name: string;
  description: string;
  attributes: CollectionAttribute[];
}

export interface CollectionData {
  name: string; // name for the collection
  description: string; // description of the collection
  image: string; // image to show on opensea
  external_link: string; // link to and external source
  seller_fee_basis_points: number; // 100 = Indicates a 1% seller fee. on OpenSea
  fee_recipient: string; // ex. "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721",
}

export enum ContractStatus {
  UploadImages,
  UploadMetadata,
  CreateCollection,
  Minting,
  Finalized,
}

export interface TokenForm {
  name: string;
  symbol: string;
  maxSupply: number;
}

export type ContractMetadataFormType = {
  name: string;
  description?: string;
  image?: string;
  external_link?: string;
};
