import type { ChainId } from "@dexkit/core";

import { useNetworkProvider } from "@dexkit/core/hooks/blockchain";


import { useMutation } from "@tanstack/react-query";




export default function useFetchTokenData({ chainId }: { chainId?: ChainId }) {


  const provider = useNetworkProvider(chainId);

  return useMutation(
    async ({ contractAddress }: { contractAddress: string }) => {
      const multical = await getMulticallFromProvider(provider);

      const iface = new utils.Interface(ERC20Abi);

      const calls: CallInput[] = [];

      calls.push({
        interface: iface,
        target: contractAddress,
        function: "name",
      });

      calls.push({
        interface: iface,
        target: contractAddress,
        function: "symbol",
      });

      calls.push({
        interface: iface,
        target: contractAddress,
        function: "decimals",
      });

      if (multical) {
        const [, results] = await multical.multiCall(calls);

        return {
          name: results[0] ?? "",
          symbol: results[1] ?? "",
          decimals: results[2] ?? "",
          address: contractAddress,
          chainId: chainId,
        } as Token;
      }

      return null;
    }
  );
}
