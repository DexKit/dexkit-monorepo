import type { AssetAPI } from '@dexkit/ui/modules/nft/types';
import type { SiteMetadata } from '@dexkit/ui/modules/wizard/types';
import type { AppWhitelabelType } from '../constants/enum';


export interface WhitelabelFormData {
  signature?: string;
  type: AppWhitelabelType.MARKETPLACE;
  config: string;
  message?: string;
  owner?: string;
  slug?: string;
  email?: string;
  siteId?: number;
}

export interface PageTemplateFormData {
  id?: number;
  config: string;
  title: string;
  description: string;
  imageUrl?: string | null;
}

export interface ConfigResponse {
  id: number;
  slug: string;
  config: string;
  isTemplate?: boolean;
  domain: string;
  cname?: string;
  domainStatus?: string;
  type: AppWhitelabelType;
  active?: boolean;
  previewUrl?: string;
  nft?: AssetAPI
}

export interface SiteResponse {
  id: number;
  slug: string;
  config: string;
  domain: string;
  cname?: string;
  owner?: string;
  clonable?: string;
  metadata: SiteMetadata,
  domainStatus?: string;
  emailVerified?: boolean;
  type: AppWhitelabelType;
  active?: boolean;
  previewUrl?: string;
  nft?: AssetAPI
  lastVersionSet?: {
    version: string;
  }
  verifyDomainRawData?: string;
  permissions?: {
    accountId: string;
    permissions: {
      [key: string]: boolean
    }

  }[]
}


