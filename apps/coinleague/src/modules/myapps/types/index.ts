import { AppWhitelabelType } from '../constants/enum';

export interface WhitelabelFormData {
  signature: string;
  type: AppWhitelabelType;
  config: string;
  message: string;
  owner: string;
  slug?: string;
}

export interface ConfigResponse {
  slug: string;
  config: string;
  domain: string;
  cname?: string;
  domainStatus?: string;
  type: AppWhitelabelType;
  active?: boolean;
}
