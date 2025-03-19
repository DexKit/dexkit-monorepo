import MultiCall, { CallInput } from "@indexed-finance/multicall";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { utils } from "ethers";

import type { providers } from "ethers";

import { ERC721Abi } from "../constants/abis";
import { Nft, NftMetadata } from "../types/nft";

export const NFT_QUERY = "NFT_QUERY";

export function useNftQuery({
  chainId,
  contractAddress,
  tokenId,
  provider,
}: {
  chainId?: number;
  contractAddress?: string;
  tokenId?: string;
  provider?: providers.Web3Provider | providers.JsonRpcProvider;
}) {
  return useQuery<Nft>(
    [NFT_QUERY, chainId, contractAddress, tokenId],
    async () => {
      if (!provider || !chainId || !tokenId || !contractAddress) {
        return {} as any;
      }

      const multicall = new MultiCall(provider);
      const iface = new utils.Interface(ERC721Abi);

      const calls: CallInput[] = [];

      calls.push({
        interface: iface,
        target: contractAddress,
        function: "symbol",
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        args: [tokenId],
        function: "ownerOf",
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        function: "name",
      });
      calls.push({
        interface: iface,
        target: contractAddress,
        args: [tokenId],
        function: "tokenURI",
      });

      const [, results] = await multicall.multiCall(calls);

      return {
        symbol: results[0],
        owner: results[1],
        collectionName: results[2],
        tokenURI: results[3],
        contractAddress,
        tokenId,
        chainId,
      } as Nft;
    },
    { enabled: tokenId !== undefined && contractAddress !== undefined },
  );
}

export const NFT_METADATA_QUERY = "NFT_METADATA_QUERY";

export function useNftMetadataQuery({ tokenURI }: { tokenURI?: string }) {
  return useQuery(
    [NFT_METADATA_QUERY, tokenURI],
    async () => {
      if (!tokenURI) {
        throw new Error("empty uri");
      }

      return (await axios.get<NftMetadata>(tokenURI)).data;
    },
    { enabled: Boolean(tokenURI) },
  );
}
