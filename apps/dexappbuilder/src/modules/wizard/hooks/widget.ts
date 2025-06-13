import { useAuth, useLoginAccountMutation } from "@dexkit/ui/hooks/auth";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation } from "@tanstack/react-query";
import { getAdminWidgetConfig, upsertWidgetConfig } from "../services/widget";

import { useQuery } from "@tanstack/react-query";




export const useSendWidgetConfigMutation = ({ id }: { id?: number }) => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();

  return useMutation(
    async ({ config }: { config: string }) => {
      if (account && provider && chainId !== undefined) {

        if (!isLoggedIn) {
          await loginMutation.mutateAsync();
        }

        let response;

        if (id) {
          response = await upsertWidgetConfig({ id, config });
        } else {
          response = await upsertWidgetConfig({ config });
        }


        return response.data;
      }
    }
  );
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

