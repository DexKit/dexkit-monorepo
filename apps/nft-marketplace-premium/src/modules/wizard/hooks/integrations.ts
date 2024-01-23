import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

export function useSaveApiKeyMutation() {
  const { instance } = useContext(DexkitApiProvider);
  const queryClient = useQueryClient();

  return useMutation(
    async (params: { siteId: number; type: string; value: string }) => {
      const result = (await instance?.post('/integrations/apikeys', params))
        ?.status;

      queryClient.refetchQueries([GET_INTEGRATION_API_KEY]);

      return result;
    }
  );
}

export const GET_INTEGRATION_API_KEY = 'GET_INTEGRATION_API_KEY';

export function useGetApiKeyQuery({
  siteId,
  type,
}: {
  siteId?: number;
  type: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery<{ type: string; value: string; siteId: number }>(
    [GET_INTEGRATION_API_KEY, siteId, type],
    async () => {
      if (siteId === undefined || instance === undefined) {
        return null;
      }

      const result = (
        await instance?.get(`/integrations/apikeys/${siteId}/${type}`)
      )?.data;

      return result;
    },
    { enabled: instance !== undefined }
  );
}

export const GET_INTEGRATION_DATA_QUERY = 'GET_INTEGRATION_DATA_QUERY';

export function useIntegrationDataQuery({
  siteId,
  type,
}: {
  siteId?: number;
  type: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery<{
    id: number;
    type: string;
    settings: any;
    siteId: number;
    createdAt: string;
    updatedAt: string;
  }>([GET_INTEGRATION_DATA_QUERY, siteId, type], async () => {
    if (siteId === undefined) {
      return null;
    }

    return (await instance?.get(`/integrations/${siteId}/${type}`))?.data;
  });
}

export function useSaveIntegrationMutation({
  siteId,
  type,
}: {
  siteId?: number;
  type: string;
}) {
  const { instance } = useContext(DexkitApiProvider);
  const queryClient = useQueryClient();
  return useMutation(async ({ data }: { data: any }) => {
    if (siteId === undefined) {
      return null;
    }

    const response = (await instance?.post(`/integrations/${siteId}/${type}`, { data }))
      ?.data;

    queryClient.refetchQueries([GET_INTEGRATION_DATA_QUERY]);
    return response;

  });
}
