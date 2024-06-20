import { ChainId } from "@dexkit/core";
import { ERC20Abi } from "@dexkit/core/constants/abis";
import { useNetworkProvider } from "@dexkit/core/hooks/blockchain";
import { Token } from "@dexkit/core/types";
import { CallInput } from "@indexed-finance/multicall";
import { useMutation } from "@tanstack/react-query";
import { Interface } from "ethers/lib/utils";
import { getMulticallFromProvider } from "../services/multical";

export default function useFetchTokenData({ chainId }: { chainId?: ChainId }) {
  const provider = useNetworkProvider(chainId);

  return useMutation(
    async ({ contractAddress }: { contractAddress: string }) => {
      const multical = await getMulticallFromProvider(provider);

      const iface = new Interface(ERC20Abi);

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
