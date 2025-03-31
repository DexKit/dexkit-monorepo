import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query';
import { useWeb3React } from '@web3-react/core';

import { useIntl } from 'react-intl';
import { AppWhitelabelType } from '../constants/enum';
import { deleteConfig, getConfig, getConfigsByOwner, getDomainConfigStatus, sendConfig, setupDomainConfig } from '../services';
import { getSignMessage, signWhitelabelData } from '../utils';

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

    const response = await getConfigsByOwner(owner);

    const data = response.data;
    return data.map(d => {
      if (d.type === AppWhitelabelType.MARKETPLACE) {
        return {
          ...d,
          appConfig: JSON.stringify(d.config)
        }
      }
      return d;
    })
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
  name,
}: {
  domain?: string;
  name?: string;
}) => {
  return useQuery(
    [QUERY_WHITELABEL_CONFIG_NAME, domain, name],
    async () => {
      if (domain === undefined && name === undefined) {
        return;
      }

      const response = await getConfig({ domain, name });
      return response.data;
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

  const { formatMessage } = useIntl();

  return useMutation<any, any, any>(
    async ({ domain, config, type }: { domain: string; config: any, type: AppWhitelabelType.MARKETPLACE }) => {
      if (account && provider && chainId !== undefined) {

        const message = formatMessage(
          getSignMessage('delete', type),
          {
            domain: domain || '',
          }
        );

        const dataToSend = await signWhitelabelData({
          provider,
          owner: account,
          chainId,
          config,
          type,
          message,
        });

        if (dataToSend) {
          await deleteConfig(dataToSend, account, domain);
          refetch()
        }
      }
    },
    options
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

export const useSendConfigMutation = ({ slug }: { slug?: string }) => {
  const { account, provider, chainId } = useWeb3React();
  const { formatMessage } = useIntl();

  return useMutation(async ({ config, type }: { config: any, type: AppWhitelabelType }) => {
    if (account && provider && chainId !== undefined) {

      const message = formatMessage(getSignMessage('edit', type));

      const dataToSend = await signWhitelabelData({
        provider,
        chainId,
        owner: account,
        config,
        type,
        message,
        slug,
      });

      if (dataToSend) {
        const response = await sendConfig(dataToSend);
        return response.data;
      }
    }
  });
};

export const useSetupDomainConfigMutation = () => {
  const { account, provider, chainId } = useWeb3React();
  const { refetch } = useWhitelabelConfigsByOwnerQuery({ owner: account });
  const { formatMessage } = useIntl();

  return useMutation(
    async ({
      domain,
      config,
      slug,
      type
    }: {
      domain: string;
      config: any;
      slug: string;
      type: AppWhitelabelType
    }) => {
      if (account && provider && chainId !== undefined) {

        const message = formatMessage(getSignMessage('addDomain', type), {
          domain: domain || '',
        });

        const dataToSend = await signWhitelabelData({
          provider,
          config,
          chainId,
          owner: account,
          type,
          message,
          slug,
        });

        if (dataToSend) {
          await setupDomainConfig(dataToSend);
          refetch();
        }
      }
    }
  );
};
