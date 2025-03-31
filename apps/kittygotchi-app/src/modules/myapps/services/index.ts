import axios from 'axios';
import { ConfigResponse, WhitelabelFormData } from '../types';

const MY_APPS_ENDPOINT =
  process.env.NEXT_PUBLIC_DEXKIT_DASH_ENDPOINT ?? 'http://localhost:3005';
//const MY_APPS_ENDPOINT = 'https://squid-app-xzo63.ondigitalocean.app';
//const MY_APPS_ENDPOINT = 'https://dexkitapi-8oo4v.ondigitalocean.app';

/**
 * send config to server
 * @param formData
 * @returns
 */

const myAppsApi = axios.create({
  baseURL: MY_APPS_ENDPOINT,
  headers: { 'content-type': 'application/json' },
});

export async function sendConfig(formData: WhitelabelFormData) {
  return await myAppsApi.post('/v4/config', formData);
}
/**
 * Get all configs associated with a wallet
 * @param owner
 * @returns
 */
export async function getConfigsByOwner(owner: string) {
  return await myAppsApi.get<ConfigResponse[]>(`/v4/config/${owner}`);
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getConfig(queryParameters: {
  domain?: string;
  name?: string;
}) {
  return await myAppsApi.get<ConfigResponse[]>(`/v4/config`, {
    params: queryParameters,
  });
}

export async function deleteConfig(
  formData: any,
  owner: string,
  domain: string
) {
  return await myAppsApi.delete<ConfigResponse[]>(`/v4/config/${owner}`, {
    data: formData,
    params: { domain },
  });
}

export const getDomainConfigStatus = async (domain: string) => {
  return await myAppsApi.get<ConfigResponse[]>(`/v4/domain-status`, {
    params: { domain },
  });
};

/**
 * setuo domain for app
 * @param formData
 * @returns
 */
export const setupDomainConfig = async (formData: any) => {
  return await myAppsApi.post<ConfigResponse[]>(`/v4/setup-domain`, formData);
};
