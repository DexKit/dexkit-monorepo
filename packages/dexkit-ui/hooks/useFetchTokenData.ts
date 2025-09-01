import type { ChainId } from "@dexkit/core";
import { ERC20Abi } from "@dexkit/core/constants/abis";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { useNetworkProvider } from "@dexkit/core/hooks/blockchain";
import type { Token } from "@dexkit/core/types";
import type { CallInput } from "@indexed-finance/multicall";
import { useMutation } from "@tanstack/react-query";
import { utils } from "ethers";
import { getMulticallFromProvider } from "../services/multical";


export default function useFetchTokenData({ chainId }: { chainId?: ChainId }) {


  const provider = useNetworkProvider(chainId);

  return useMutation(
    async ({ contractAddress }: { contractAddress: string }) => {
      if (contractAddress.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()) {
        return null;
      }
      
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
