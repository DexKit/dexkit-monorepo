import { providers } from "ethers";
import { ChainId } from "../constants/enums";
import { NETWORKS } from "../constants/networks";

/**
 * 
 * @param chainId 
 * @returns an  based provider
 */
export function useNetworkProvider(chainId?: ChainId) {
  if (chainId) {
    const providerRpcUrl = NETWORKS[chainId]?.providerRpcUrl;
    if (providerRpcUrl) {
      return new providers.JsonRpcProvider(providerRpcUrl);
    }
  }
}