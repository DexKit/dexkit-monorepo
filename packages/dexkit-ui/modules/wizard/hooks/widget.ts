import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";
import { useAuth, useLoginAccountMutation } from "../../../hooks/auth";
import { deleteWidget, getWidgetConfig, getWidgetsByOwner } from "../services/widget";
import { WidgetConfig } from "../types/widget";

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

      const configParsed = JSON.parse(response.data.config) as WidgetConfig


      return { ...response.data, configParsed: configParsed }


    }
  );
};

export const QUERY_WIDGET_CONFIGS_BY_OWNER_NAME =
  'GET_WIDGET_CONFIGS_BY_OWNER_QUERY';

export const useWidgetsByOwnerQuery = () => {
  return useQuery([QUERY_WIDGET_CONFIGS_BY_OWNER_NAME], async () => {


    const { data } = await getWidgetsByOwner();

    const newData = data.map((item) => {
      return {
        ...item,
        configParsed: JSON.parse(item.config) as WidgetConfig,
      };
    })

    return newData;
  });
};

export const useDeleteWidgetMutation = ({
  options,
}: {
  options?: UseMutationOptions;
}) => {
  const { account, provider, chainId } = useWeb3React();
  const { isLoggedIn } = useAuth();
  const loginMutation = useLoginAccountMutation();
  const { refetch } = useWidgetsByOwnerQuery();

  return useMutation<any, any, any>(
    async ({ id }: { id: number }) => {
      if (account && provider && chainId !== undefined) {

        if (!isLoggedIn) {
          await loginMutation.mutateAsync();
        }


        await deleteWidget({ id });
        refetch();

      }
    }, options);
};