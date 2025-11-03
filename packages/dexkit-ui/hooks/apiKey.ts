import { useDexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";


export const API_KEY_BY_ACCOUNT_QUERY = "API_KEY_BY_ACCOUNT_QUERY";


export function useApiKeyByAccount() {
  const { instance } = useDexkitApiProvider();
  return useQuery<{ uuid: string, monthlyCount: number }>(
    [API_KEY_BY_ACCOUNT_QUERY],
    async () => {
      return (await instance?.get(`/api-key/by-account`))?.data;
    });
}