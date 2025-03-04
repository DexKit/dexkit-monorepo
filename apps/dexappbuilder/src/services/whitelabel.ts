import type { CollectionOwnershipNFTFormType } from '@/modules/contract-wizard/types';
import { myAppsApi as myAppsApiUI } from '@dexkit/ui/constants/api';
import type { SiteMetadata } from '@dexkit/ui/modules/wizard/types';
import type { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import { getAccessToken, getAccessTokenAndRefresh, getRefreshAccessToken } from '@dexkit/ui/services/auth';
import axios from 'axios';
import type {
  ConfigResponse,
  PageTemplateFormData,
  PageTemplateResponse,
  SiteResponse,
  WhitelabelFormData
} from '../types/whitelabel';


//const MY_APPS_ENDPOINT = 'https://dexkitapi-8oo4v.ondigitalocean.app';
//const MY_APPS_ENDPOINT = 'http://localhost:3001';
//const MY_APPS_ENDPOINT = `${DEXKIT_BASE_API_URL}`;
//const MY_APPS_ENDPOINT = 'https://squid-app-xzo63.ondigitalocean.app';

/**
 * send config to server
 * @param formData
 * @returns
 */

export const myAppsApi = myAppsApiUI;



export const testAppsApi = axios.create({
  baseURL: 'http://localhost:3001',
  headers: { 'content-type': 'application/json' },
});

testAppsApi.interceptors.request.use(
  async (config) => {
    const access_token = await getAccessTokenAndRefresh();
    if (access_token)
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${access_token}`,
      };
    return config;
  },
  async function (error) {
    try {
      const access_token = await getAccessToken();
      if (error.response.status === 401 && access_token) {
        return await getAccessTokenAndRefresh();
      }
    } catch {
      return Promise.reject(error);
    }
  }
);

testAppsApi.interceptors.response.use(
  async (response) => {
    return response;
  },
  async function (error) {
    try {
      const access_token = await getAccessToken();
      if (error.response.status === 401 && access_token) {
        return await getRefreshAccessToken();
      }
    } catch {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

/*myAppsApi.interceptors.request.use(
  async (config) => {
    const access_token = await getAccessTokenAndRefresh();
    if (access_token)
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${access_token}`,
      };
    return config;
  },
  async function (error) {
    try {
      const access_token = await getAccessToken();
      if (error.response.status === 401 && access_token) {
        return await getAccessTokenAndRefresh();
      }
    } catch {
      return Promise.reject(error);
    }
  }
);

myAppsApi.interceptors.response.use(
  async (response) => {
    return response;
  },
  async function (error) {
    try {
      const access_token = await getAccessToken();
      if (error.response.status === 401 && access_token) {
        return await getRefreshAccessToken();
      }
    } catch {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);*/

export async function sendConfig(formData: WhitelabelFormData) {
  return await myAppsApi.post<{ slug: string }>('/site/create-site', formData);
}

export async function upsertPageTemplate(formData: PageTemplateFormData) {
  return await myAppsApi.post('/site/create-page-template', formData);
}

/**
 * Get all configs associated with a wallet
 * @param owner
 * @returns
 */
export async function getConfigsByOwner(owner: string) {
  return await myAppsApi.get<ConfigResponse[]>(`/site/${owner}`);
}

/**
 * Get page template by Id
 * @param id
 * @returns
 */
export async function getPageTemplateById(id: string) {
  return await myAppsApi.get<PageTemplateResponse>(
    `/site/page-template/id/${id}`
  );
}

/**
 * Get all page tempaltes associated with a wallet
 * @param owner
 * @returns
 */
export async function getPageTemplatesByOwner(owner: string) {
  return await myAppsApi.get<PageTemplateResponse[]>(
    `/site/page-template/${owner}`
  );
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getConfig(queryParameters: {
  domain?: string;
  slug?: string;
  appPage?: string;
}) {
  return await myAppsApi.get<SiteResponse>(`/site`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
      ['app-page']: queryParameters.appPage,
    },
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getTemplateConfig(queryParameters: {
  domain?: string;
  slug?: string;
}) {
  return await myAppsApi.get<ConfigResponse>(`/site/template`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
    },
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getSitemapConfig(queryParameters: {
  domain?: string;
  slug?: string;
}) {
  return await myAppsApi.get<ConfigResponse>(`/site/sitemap`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
    },
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getAdminConfig(queryParameters: {
  domain?: string;
  slug?: string;
  appPage?: string;
}) {
  return await myAppsApi.get<SiteResponse>(`/site/admin`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
    },
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getProtectedAppConfig(queryParameters: {
  domain?: string;
  slug?: string;
  appPage?: string;
}) {

  return await myAppsApi.get<{ sections: AppPageSection[], result: boolean, balances: { [key: number]: string }, partialResults: { [key: number]: boolean } }>(`/site/protected`, {
    params: {
      domain: queryParameters.domain,
      slug: queryParameters.slug,
      ['app-page']: queryParameters.appPage,
    },
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getSites(queryParameters: {
  isTemplate?: boolean;
  skip?: number;
  take?: number;
}) {
  return await myAppsApi.get<SiteResponse[]>(`/site/all-open`, {
    params: queryParameters,
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getTemplateSites(queryParameters: {
  usecases?: string[];
  skip?: number;
  take?: number;
}) {
  return await myAppsApi.get<SiteResponse[]>(`/site/all-open-templates`, {
    params: queryParameters,
  });
}

/**
 * Get config by name or domain, at least one of these parameters should be passed
 * @param queryParameters
 * @returns
 */
export async function getSiteMetadata({ slug }: { slug: string }) {
  return await myAppsApi.get<SiteResponse>(`/site/metadata/${slug}`
  );
}

export async function deleteConfig(slug: string) {
  return await myAppsApi.delete<ConfigResponse[]>(`/site`, {
    params: { slug },
  });
}

export async function deletePageTemplate(id: string) {
  return await myAppsApi.delete<PageTemplateResponse[]>(
    `/site/page-template/${id}`
  );
}

export async function getDomainConfigStatus(domain: string) {
  return await myAppsApi.get<ConfigResponse[]>(`/site/domain-status`, {
    params: { domain },
  });
}

export async function getVerifyDomain(domain: string) {
  return await myAppsApi.get<ConfigResponse[]>(`/site/verify-domain`, {
    params: { domain },
  });
}

/**
 * setuo domain for app
 * @param formData
 * @returns
 */
export async function setupDomainConfig(domain: string) {
  return await myAppsApi.get<ConfigResponse[]>(`/site/setup-domain`, {
    params: { domain },
  });
}

export async function upsertWhitelabelAsset(
  siteId: number,
  nft: CollectionOwnershipNFTFormType
) {
  return await myAppsApi.post<ConfigResponse[]>(
    `/contract/upsert/whitelabel/asset`,
    { siteId, nft }
  );
}

export async function upsertSiteMetadata(
  siteId: number,
  siteMedata: SiteMetadata
) {
  return await myAppsApi.post<SiteResponse[]>(
    `/site/upsert/metadata/${siteId}`,
    { ...siteMedata }
  );
}
