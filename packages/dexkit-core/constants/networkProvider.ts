import { providers } from "ethers";
import { ChainId } from "./enums";
import { NETWORKS } from "./networks";

export const NETWORK_PROVIDER = (chainId?: ChainId) => {
  if (!chainId || !NETWORKS[chainId]) {
    return undefined;
  }

  const network = NETWORKS[chainId];

  const networkConfig = {
    name: network.name.toLowerCase(),
    chainId: network.chainId,
  };

  return new providers.JsonRpcProvider(network.providerRpcUrl, networkConfig);
};