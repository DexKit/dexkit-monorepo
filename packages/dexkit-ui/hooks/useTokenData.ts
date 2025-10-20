import type { ChainId } from "@dexkit/core";
import { ERC20Abi } from "@dexkit/core/constants/abis";
import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants/zrx";
import { useNetworkProvider } from "@dexkit/core/hooks/blockchain";
import type { Token } from "@dexkit/core/types";
import type { CallInput } from "@indexed-finance/multicall";
import { useQuery } from "@tanstack/react-query";
import { utils } from "ethers";
import { isAddress } from 'viem';
import { getMulticallFromProvider } from "../services/multical";

export function useTokenData({ chainId, address }: { chainId?: ChainId, address?: string }) {

  const provider = useNetworkProvider(chainId);

  return useQuery([chainId, address],
    async () => {
      if (!address || !chainId) {
        return null
      }

      if (address.toLowerCase() === ZEROEX_NATIVE_TOKEN_ADDRESS.toLowerCase()) {
        return null;
      }

      if (!isAddress(address, { strict: false })) {
        return null
      }

      const multical = await getMulticallFromProvider(provider);

      const iface = new utils.Interface(ERC20Abi);

      const calls: CallInput[] = [];

      calls.push({
        interface: iface,
        target: address,
        function: "name",
      });

      calls.push({
        interface: iface,
        target: address,
        function: "symbol",
      });

      calls.push({
        interface: iface,
        target: address,
        function: "decimals",
      });

      if (multical) {
        const [, results] = await multical.multiCall(calls);

        return {
          name: results[0] ?? "",
          symbol: results[1] ?? "",
          decimals: results[2] ?? "",
          address: address,
          chainId: chainId,
        } as Token;
      }

      return null;
    }
  );
}
