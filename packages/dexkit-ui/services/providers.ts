import { getChainIdFromSlug } from "@dexkit/core/utils/blockchain";
import { providers } from "ethers";

export function getProviderBySlug(slug: string) {
  const network = getChainIdFromSlug(slug);

  if (network?.chainId !== undefined && network?.providerRpcUrl) {
    return new providers.JsonRpcProvider(network.providerRpcUrl);
  }
}
