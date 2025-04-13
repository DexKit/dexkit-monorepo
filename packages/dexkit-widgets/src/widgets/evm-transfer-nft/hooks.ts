import { ChainId } from "@dexkit/core/constants";
import { ERC721Abi } from "@dexkit/core/constants/abis";
import { NETWORK_PROVIDER } from "@dexkit/core/constants/networkProvider";
import { useMutation } from "@tanstack/react-query";
import { Contract, providers } from "ethers";
import { ERC1155Abi } from "../../constants/abis";

export function useNftTransfer({
  contractAddress,
  signer,
  onSubmit,
}: {
  contractAddress?: string;
  tokenId?: string;

  signer?: providers.JsonRpcSigner;
  onSubmit?: (hash: string) => void;
}) {
  return useMutation(
    async ({
      to,
      from,
      tokenId,
      protocol,
      quantity,
    }: {
      to: string;
      from: string;
      protocol?: "ERC721" | "ERC1155";
      tokenId: string;
      quantity?: string;
    }) => {
      if (
        !contractAddress ||
        !tokenId ||
        !signer ||
        (protocol === "ERC1155" && !quantity)
      ) {
        return false;
      }

      let contract = new Contract(
        contractAddress,
        protocol === "ERC1155" ? ERC1155Abi : ERC721Abi,
        signer
      );
      let toAddress: string | null = to;
      if (to.split(".").length > 1) {
        const networkProvider = NETWORK_PROVIDER(ChainId.Ethereum);
        if (networkProvider) {
          toAddress = await networkProvider.resolveName(to);
        }
      }

      if (!toAddress) {
        return;
      }
      let tx;
      if (protocol === "ERC1155") {
        tx = await contract.safeTransferFrom(
          from,
          toAddress,
          tokenId,
          quantity,
          ""
        );
      } else {
        tx = await contract.safeTransferFrom(from, toAddress, tokenId);
      }

      if (onSubmit) {
        onSubmit(tx.hash);
      }

      return await tx.wait();
    }
  );
}
