import { ERC1155Abi } from "@dexkit/core/constants/abis";
import { getProviderByChainId } from "@dexkit/core/utils/blockchain";
import MultiCall, { CallInput } from "@indexed-finance/multicall";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NFTDrop } from "@thirdweb-dev/sdk";
import { Interface } from "ethers/lib/utils";

export function useClaimNft({ contract }: { contract?: NFTDrop }) {
  return useMutation(async ({ quantity }: { quantity: number }) => {
    return await contract?.erc721.claim.prepare(quantity);
  });
}

export const EDITION_CONTRACT_QUERY = "EDITION_CONTRACT_QUERY";

export function useEdition({
  chainId,
  contractAddress,
}: {
  chainId?: number;
  contractAddress?: string;
}) {
  return useQuery(
    [EDITION_CONTRACT_QUERY, chainId, contractAddress],
    async () => {
      if (!contractAddress || !chainId) {
        return;
      }

      const provider = getProviderByChainId(chainId);

      await provider?.ready;

      const multicall = new MultiCall(provider);

      const calls: CallInput[] = [];

      const iface = new Interface(ERC1155Abi);

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

      const [, results] = await multicall.multiCall(calls);

      return {
        name: results[0] as string,
        symbol: results[1] as string,
      };
    },
  );
}
