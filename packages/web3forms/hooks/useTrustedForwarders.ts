import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useQuery } from "@tanstack/react-query";
import { dkGetTrustedForwarders } from "../utils";

const QUERY = "GET_TRUSTED_FORWARDERS";

export function useTrustedForwarders({ clientId }: { clientId: string }) {
  const { provider, chainId } = useWeb3React();

  return useQuery([QUERY, chainId, clientId], async () => {
    if (provider) {
      const forwarders = await dkGetTrustedForwarders(provider, clientId);
      if (forwarders) {
        return forwarders;
      } else {
        return [];
      }
    } else {
      return [];
    }
  });
}
