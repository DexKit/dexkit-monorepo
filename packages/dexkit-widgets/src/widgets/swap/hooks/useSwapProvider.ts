import { ChainId } from "@dexkit/core/constants";
import { NETWORKS } from "@dexkit/core/constants/networks";
import { providers } from "ethers";
import { useMemo } from "react";

export function useSwapProvider({
  defaultChainId,
}: {
  defaultChainId?: ChainId;
  disableWallet?: boolean;
}) {
  return useMemo(() => {
    if (defaultChainId && NETWORKS[defaultChainId]?.providerRpcUrl) {
      const network = NETWORKS[defaultChainId];

      const networkConfig = {
        name: network.name.toLowerCase(),
        chainId: network.chainId,
      };

      return new providers.JsonRpcProvider(
        network.providerRpcUrl,
        networkConfig
      );
    }
  }, [defaultChainId]);
}
