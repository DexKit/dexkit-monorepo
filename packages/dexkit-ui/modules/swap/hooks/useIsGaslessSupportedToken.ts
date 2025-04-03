import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ZeroExApiClient } from "../services/zrxClient";

/**
 * Some tokens on Ethereum network are not supported
 * @param param0
 * @returns
 */
export function useIsGaslessSupportedToken({
  chainId,
  useGasless,
  sellToken,
}: {
  chainId?: number;
  useGasless?: boolean;
  sellToken?: string;
}) {
  const sellTokenExists = sellToken !== undefined;

  const isTokenSupported = useQuery(
    ["is_gasless_supported", chainId, useGasless, sellTokenExists],
    async () => {
      if (!chainId || !sellTokenExists) {
        return null;
      }

      const client = new ZeroExApiClient(chainId);
      return await client.isTokenGaslessSupported();
    },
    { staleTime: Infinity }
  );

  return useMemo(() => {
    if (!sellToken || !chainId) {
      return false;
    }

    if (isTokenSupported.data?.data && sellToken) {
      const data = isTokenSupported.data.data;
      const isGaslessSupported = !!data.chains.find((chain: any) => chain.chainId === chainId)
      return isGaslessSupported;
    }
    return false;
  }, [chainId, useGasless, sellToken, isTokenSupported.data]);
}
