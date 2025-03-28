export interface KittygotchiTraitItem {
  holding: number;
  value: string;
}

export interface KittygotchiRankingItem {
  owner: string;
  tokenId: string;
  strength: number;
}


export interface Kittygotchi {
  id: string;
  attack: number;
  defense: number;
  run: number;
  image?: string;
  description?: string;
  name?: string;
  attributes?: any;
  lastUpdated?: number;
}
