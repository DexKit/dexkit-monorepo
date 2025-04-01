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
    () => {
      if (chainId !== 1 && useGasless) {
        return null;
      }
      if (!chainId || !sellTokenExists) {
        return null;
      }
      // We just need to call this on Ethereum chain
      if (chainId === 1) {
        const client = new ZeroExApiClient(chainId);

        const data = client.isTokenGaslessSupported();

        return data;
      }
      return null;
    },
    { staleTime: Infinity },
  );

  return useMemo(() => {
    if (!sellToken || !chainId) {
      return false;
    }

    if (chainId !== 1 && useGasless) {
      return true;
    }
    if (isTokenSupported.data?.data && sellToken) {
      return isTokenSupported.data.data.includes(sellToken.toLowerCase());
    }
    return false;
  }, [chainId, useGasless, sellToken, isTokenSupported.data]);
}
