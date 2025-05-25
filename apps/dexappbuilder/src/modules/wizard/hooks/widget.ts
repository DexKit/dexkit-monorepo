import { useAuth, useLoginAccountMutation } from "@dexkit/ui/hooks/auth";
import { WidgetConfig } from "@dexkit/ui/modules/wizard/types/widget";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation } from "@tanstack/react-query";
import { createWidgetConfig, getAdminWidgetConfig, getWidgetConfig, getWidgetsByOwner, updateWidgetConfig } from "../services/widget";

import { useQuery } from "@tanstack/react-query";




export const useSendWidgetConfigMutation = ({ id }: { id?: number }) => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({ config }: { config: WidgetConfig }) => {
      if (account && provider && chainId !== undefined) {

        if (!isLoggedIn) {
          await loginMutation.mutateAsync();
        }

        let response;

        if (id) {
          response = await updateWidgetConfig({ id, config });
        } else {
          response = await createWidgetConfig({ config });
        }


        return response.data;
      }
    }
  );
};


interface ConfigsByOwnerParams {
  owner?: string;
}

export const QUERY_WIDGET_CONFIGS_BY_OWNER_NAME =
  'GET_WIDGET_CONFIGS_BY_OWNER_QUERY';

export const useWidgetsByOwnerQuery = ({
  owner,
}: ConfigsByOwnerParams) => {
  return useQuery([QUERY_WIDGET_CONFIGS_BY_OWNER_NAME, owner], async () => {
    if (!owner) return null;


    const { data } = await getWidgetsByOwner(owner);

    return data;
  });
};

export const QUERY_ADMIN_WIDGET_CONFIG = 'GET_ADMIN_WIDGET_CONFIG_QUERY';
/**
 * get widget config by name or query
 * @param param0
 * @returns
 */
export const useAdminWidgetConfigQuery = ({
  id,
}: {
  id?: number
}) => {
  const { setIsLoggedIn } = useAuth();


  return useQuery(
    [QUERY_ADMIN_WIDGET_CONFIG, id || null],
    async () => {
      if (id === undefined) {
        return null;
      }

      const response = (await getAdminWidgetConfig({ id }));

      if (response.status === 401 && setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      return response.data


    },
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );
};

export const QUERY_WIDGET_CONFIG_NAME = 'GET_WIDGET_CONFIG_QUERY';
/**
 * get widget config by name or query
 * @param param0
 * @returns
 */
export const useWidgetConfigQuery = ({
  id,
}: {
  id?: number
}) => {

  return useQuery(
    [QUERY_WIDGET_CONFIG_NAME, id || null],
    async () => {
      if (id === undefined) {
        return null;
      }

      const response = (await getWidgetConfig({ id }));

      return response.data


    }
  );
};