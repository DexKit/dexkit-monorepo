import { providers } from "ethers";
import { ChainId } from "./enums";
import { NETWORKS } from "./networks";

export const NETWORK_PROVIDER = (chainId?: ChainId) => {
  return chainId && NETWORKS[chainId]
    ? new providers.JsonRpcProvider(NETWORKS[chainId].providerRpcUrl)
    : undefined;
};
