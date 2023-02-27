import { CollectionOwnershipNFTFormType } from '@/modules/contract-wizard/types';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';
import { AppWhitelabelType } from '../constants/enum';
import {
  deleteConfig,
  deletePageTemplate,
  getConfig,
  getConfigsByOwner,
  getDomainConfigStatus,
  getPageTemplateById,
  getPageTemplatesByOwner,
  getSites,
  getVerifyDomain,
  sendConfig,
  setupDomainConfig,
  upsertPageTemplate,
  upsertWhitelabelAsset,
} from '../services/whitelabel';
import { AppConfig } from '../types/config';
import { PageTemplateFormData } from '../types/whitelabel';
import {
  useAccountHoldDexkitMutation,
  useAuth,
  useLoginAccountMutation,
} from './account';

export const useSendConfigMutation = ({ slug }: { slug?: string }) => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  const configQuery = useWhitelabelConfigQuery({
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
        });
        configQuery.refetch();
        return response.data;
      }
    }
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

export const QUERY_WHITELABEL_CONFIGS_BY_OWNER_NAME =
  'GET_WHITELABEL_CONFIGS_BY_OWNER_QUERY';

interface ConfigsByOwnerParams {
  owner?: string;
}

export const useWhitelabelConfigsByOwnerQuery = ({
  owner,
}: ConfigsByOwnerParams) => {
  return useQuery([QUERY_WHITELABEL_CONFIGS_BY_OWNER_NAME, owner], async () => {
    if (!owner) return;

    return (await getConfigsByOwner(owner)).data.map((resp) => ({
      ...resp,
      appConfig: JSON.parse(resp.config) as AppConfig,
    }));
  });
};

export const QUERY_WHITELABEL_SITES_QUERY = 'GET_WHITELABEL_SITESQUERY';

export const useWhitelabelSitesListQuery = () => {
  return useQuery([QUERY_WHITELABEL_SITES_QUERY], async () => {
    return (await getSites({})).data.map((resp) => ({
      ...resp,
      appConfig: JSON.parse(resp.config) as AppConfig,
    }));
  });
};

export const QUERY_PAGE_TEMPLATES_CONFIGS_BY_OWNER_NAME =
  'GET_PAGE_TEMPLATES_CONFIGS_BY_OWNER_QUERY';

export const usePageTemplatesByOwnerQuery = ({
  owner,
}: ConfigsByOwnerParams) => {
  return useQuery(
    [QUERY_PAGE_TEMPLATES_CONFIGS_BY_OWNER_NAME, owner],
    async () => {
      if (!owner) return;

      return (await getPageTemplatesByOwner(owner)).data;
    }
  );
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
    [QUERY_WHITELABEL_CONFIG_NAME, domain, slug],
    async () => {
      if (domain === undefined && slug === undefined) {
        return;
      }

      return (await getConfig({ domain, slug })).data;
    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
};

export const useDeleteMyAppMutation = ({
  options,
}: {
  options?: UseMutationOptions;
}) => {
  const { account, provider, chainId } = useWeb3React();
  const { refetch } = useWhitelabelConfigsByOwnerQuery({ owner: account });
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation<any, any, any>(async ({ slug }: { slug: string }) => {
    if (account && provider && chainId !== undefined) {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }

      await deleteConfig(slug);
      refetch();
    }
  }, options);
};

export const useDeletePageTemplateMutation = ({
  options,
}: {
  options?: UseMutationOptions;
}) => {
  const { account, provider, chainId } = useWeb3React();
  const { refetch } = usePageTemplatesByOwnerQuery({ owner: account });
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation<any, any, any>(async ({ id }: { id: string }) => {
    if (account && provider && chainId !== undefined && id) {
      if (!isLoggedIn) {
        await loginMutation.mutateAsync();
      }
      await deletePageTemplate(id);
      refetch();
    }
  }, options);
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
    queryClient.invalidateQueries({ queryKey: [QUERY_WHITELABEL_CONFIG_NAME] });
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_WHITELABEL_CONFIG_NAME],
      });
    }
  });
};

export const useUpsertWhitelabelAssetMutation = () => {
  const { account, provider, chainId } = useWeb3React();
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
        await isHoldingKit.mutateAsync();

        if (!isLoggedIn) {
          await loginMutation.mutateAsync();
        }
        await upsertWhitelabelAsset(siteId, nft);
        queryClient.invalidateQueries({
          queryKey: [QUERY_WHITELABEL_CONFIG_NAME],
        });
      }
    }
  );
};
