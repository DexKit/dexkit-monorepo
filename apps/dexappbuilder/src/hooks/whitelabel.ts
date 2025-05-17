import { CollectionOwnershipNFTFormType } from '@/modules/contract-wizard/types';
import { SiteMetadata } from '@dexkit/ui/modules/wizard/types';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { holdsKitDialogAtom } from 'src/state/atoms';
import { AppWhitelabelType } from '../constants/enum';
import {
  getAdminConfig,
  getDomainConfigStatus,
  getPageTemplateById,
  getSiteMetadata,
  getSites,
  getTemplateConfig,
  getTemplateSites,
  getVerifyDomain,
  sendConfig,
  setupDomainConfig,
  upsertPageTemplate,
  upsertSiteMetadata,
  upsertWhitelabelAsset,
} from '../services/whitelabel';

import { PageTemplateFormData } from '../types/whitelabel';

import { useAccountHoldDexkitMutation } from '@dexkit/ui/hooks/account';
import { useAuth, useLoginAccountMutation } from '@dexkit/ui/hooks/auth';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useSiteId } from './app';

import { useDeleteMyAppMutation } from '@dexkit/ui/modules/whitelabel/hooks/useDeleteMyAppMutation';
import { useDeletePageTemplateMutation } from '@dexkit/ui/modules/whitelabel/hooks/useDeletePageTemplateMutation';
import { usePageTemplatesByOwnerQuery } from '@dexkit/ui/modules/whitelabel/hooks/usePageTemplatesByOwnerQuery';
import { useWhitelabelConfigsByOwnerQuery } from '@dexkit/ui/modules/whitelabel/hooks/useWhitelabelConfigsByOwnerQuery';
import { getConfig } from '@dexkit/ui/services/whitelabel';

export {
  useDeleteMyAppMutation,
  useDeletePageTemplateMutation,
  usePageTemplatesByOwnerQuery,
  useWhitelabelConfigsByOwnerQuery,
};
//import SiteConfig from '../../config/dexappbuilder.json';

export const useSendConfigMutation = ({ slug }: { slug?: string }) => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  const siteId = useSiteId();
  const configQuery = useAdminWhitelabelConfigQuery({
    slug: slug as string,
  });

  return useMutation(
    async ({ config, email }: { config: AppConfig; email?: string }) => {
      if (account && provider && chainId !== undefined) {
        const type = AppWhitelabelType.MARKETPLACE;
        if (!isLoggedIn) {
          await loginMutation.mutateAsync();
        }
        const response = await sendConfig({
          config: JSON.stringify(config),
          type,
          slug,
          email,
          siteId,
        });
        configQuery.refetch();
        return response.data;
      }
    },
  );
};

export const useUpsertPageTemplateMutation = () => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  const queryClient = useQueryClient();

  return useMutation(async ({ data }: { data?: PageTemplateFormData }) => {
    if (account && provider && chainId !== undefined && data) {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      await upsertPageTemplate(data);
      if (data.id) {
        queryClient.invalidateQueries([
          QUERY_PAGE_TEMPLATES_CONFIG_BY_ID,
          data.id,
        ]);
      }
    }
  });
};

export const QUERY_WHITELABEL_SITES_QUERY = 'GET_WHITELABEL_SITESQUERY';

export const useWhitelabelSitesListQuery = (queryParameters: {
  isTemplate?: boolean;
  skip?: number;
  take?: number;
}) => {
  return useQuery([QUERY_WHITELABEL_SITES_QUERY], async () => {
    return (await getSites(queryParameters)).data.map((resp) => ({
      ...resp,
      appConfig: JSON.parse(resp.config) as AppConfig,
    }));
  });
};

export const QUERY_WHITELABEL_TEMPLATE_SITES_QUERY =
  'GET_WHITELABEL_TEMPLATES_SITES_QUERY';

export const useWhitelabelTemplateSitesListQuery = (queryParameters: {
  usecases?: string[];
  isTemplate?: boolean;
  skip?: number;
  take?: number;
}) => {
  return useQuery(
    [QUERY_WHITELABEL_TEMPLATE_SITES_QUERY, queryParameters.usecases],
    async () => {
      return (await getTemplateSites(queryParameters)).data;
    },
  );
};

export const GET_SITE_METADATA_QUERY = 'GET_SITE_METADATA_QUERY';

export const useSiteMetadataQuery = ({ slug }: { slug: string }) => {
  return useQuery([GET_SITE_METADATA_QUERY], async () => {
    return (await getSiteMetadata({ slug })).data;
  });
};

export const QUERY_PAGE_TEMPLATES_CONFIG_BY_ID =
  'GET_PAGE_TEMPLATES_CONFIG_BY_ID_QUERY';

export const usePageTemplateByIdQuery = ({ id }: { id: string }) => {
  return useQuery([QUERY_PAGE_TEMPLATES_CONFIG_BY_ID, id], async () => {
    if (!id) return;

    return (await getPageTemplateById(id)).data;
  });
};

export const QUERY_WHITELABEL_CONFIG_NAME = 'GET_WHITELABEL_CONFIG_QUERY';

/**
 * get config by name or query
 * @param param0
 * @returns
 */
export const useWhitelabelConfigQuery = ({
  domain,
  slug,
}: {
  domain?: string;
  slug?: string;
}) => {
  return useQuery(
    [QUERY_WHITELABEL_CONFIG_NAME, domain || null, slug || null],
    async () => {
      if (domain === undefined && slug === undefined) {
        return null;
      }

      return (await getConfig({ domain, slug })).data;
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  );
};

/**
 * get config by name or query
 * @param param0
 * @returns
 */
export const useTemplateWhitelabelConfigQuery = ({
  domain,
  slug,
}: {
  domain?: string;
  slug?: string;
}) => {
  return useQuery(
    [QUERY_WHITELABEL_CONFIG_NAME, domain || null, slug || null],
    async () => {
      if (domain === undefined && slug === undefined) {
        return null;
      }

      return (await getTemplateConfig({ domain, slug })).data;
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  );
};

export const QUERY_ADMIN_WHITELABEL_CONFIG_NAME =
  'GET_ADMIN_WHITELABEL_CONFIG_QUERY';
/**
 * get config by name or query
 * @param param0
 * @returns
 */
export const useAdminWhitelabelConfigQuery = ({
  domain,
  slug,
}: {
  domain?: string;
  slug?: string;
}) => {
  const { setIsLoggedIn } = useAuth();

  return useQuery(
    [QUERY_ADMIN_WHITELABEL_CONFIG_NAME, domain || null, slug || null],
    async () => {
      if (domain === undefined && slug === undefined) {
        return null;
      }

      const response = await getAdminConfig({ domain, slug });

      if (response.status === 401 && setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      return response.data;
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false },
  );
};

export const useDomainConfigStatusMutation = () => {
  const { account } = useWeb3React();
  const { refetch } = useWhitelabelConfigsByOwnerQuery({ owner: account });

  return useMutation(async ({ domain }: { domain: string }) => {
    await getDomainConfigStatus(domain);
    refetch();
  });
};

export const useVerifyDomainMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(async ({ domain }: { domain: string }) => {
    await getVerifyDomain(domain);
    queryClient.invalidateQueries([QUERY_WHITELABEL_CONFIG_NAME]);
  });
};

export const useSetupDomainConfigMutation = () => {
  const { account, provider, chainId } = useWeb3React();

  // Get QueryClient from the context
  const queryClient = useQueryClient();

  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(async ({ domain }: { domain: string }) => {
    if (account && provider && chainId !== undefined) {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      await setupDomainConfig(domain);
      queryClient.invalidateQueries([QUERY_WHITELABEL_CONFIG_NAME]);
    }
  });
};

export const useUpsertWhitelabelAssetMutation = () => {
  const { account, provider, chainId } = useWeb3React();

  const setIsHoldingKit = useSetAtom(holdsKitDialogAtom);
  const isHoldingKit = useAccountHoldDexkitMutation();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation<any, any, any>(
    async ({
      siteId,
      nft,
    }: {
      siteId: number;
      nft: CollectionOwnershipNFTFormType;
    }) => {
      if (account && provider && chainId !== undefined) {
        try {
          await isHoldingKit.mutateAsync();
        } catch {
          setIsHoldingKit(true);
          return false;
        }

        if (!isLoggedIn) {
          await loginMutation.mutateAsync();
        }
        await upsertWhitelabelAsset(siteId, nft);
        queryClient.invalidateQueries([QUERY_WHITELABEL_CONFIG_NAME]);
      }
    },
  );
};

export const useUpsertSiteMetadataMutation = () => {
  const { account, provider, chainId } = useWeb3React();

  const queryClient = useQueryClient();

  return useMutation<any, any, any>(
    async ({
      siteId,
      siteMetadata,
    }: {
      siteId: number;
      siteMetadata: SiteMetadata;
    }) => {
      if (account) {
        await upsertSiteMetadata(siteId, siteMetadata);
        queryClient.invalidateQueries([GET_SITE_METADATA_QUERY]);
      }
    },
  );
};
