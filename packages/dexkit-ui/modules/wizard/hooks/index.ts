import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { useQuery } from "@tanstack/react-query";
import { providers } from "ethers";

export const JSON_RPC_PROVIDER = "JSON_RPC_PROVIDER";

export function useJsonRpcProvider({ chainId }: { chainId: ChainId }) {
  return useQuery([JSON_RPC_PROVIDER, chainId], () => {
    if (chainId) {
      return new providers.JsonRpcProvider(NETWORKS[chainId].providerRpcUrl);
    }
  });
}
