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
