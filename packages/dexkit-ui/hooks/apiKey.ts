import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";


export const API_KEY_BY_ACCOUNT_QUERY = "API_KEY_BY_ACCOUNT_QUERY";


export function useApiKeyByAccount() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<{ uuid: string, monthlyCount: number }>(
    [API_KEY_BY_ACCOUNT_QUERY],
    async () => {
      return (await instance?.get(`/api-key/by-account`))?.data;
    });
}