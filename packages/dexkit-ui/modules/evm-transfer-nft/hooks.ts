import { ChainId } from "@dexkit/core/constants";
import { ERC1155Abi, ERC721Abi } from "@dexkit/core/constants/abis";
import { NETWORK_PROVIDER } from "@dexkit/core/constants/networkProvider";
import { useMutation } from "@tanstack/react-query";
import type { providers } from "ethers";
import { Contract } from "ethers";
export function useNftTransfer({
  contractAddress,
  signer,
  onSubmit,
  onConfirm,
}: {
  contractAddress?: string;
  tokenId?: string;
  signer?: providers.JsonRpcSigner;
  onSubmit?: ({ hash }: { hash: string, isERC1155: boolean, to: string, quantity?: string }) => void;
  onConfirm?: ({ hash }: { hash: string, isERC1155: boolean, to: string, quantity?: string }) => void;
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
          "0x"
        );
      } else {
        tx = await contract.transferFrom(from, toAddress, tokenId);
      }

      if (onSubmit) {
        onSubmit({ hash: tx.hash, to: toAddress, isERC1155: protocol === "ERC1155", quantity: quantity || '1' });
      }

      const txResult = await tx.wait();

      if (onConfirm) {
        onConfirm({ hash: tx.hash, to: toAddress, isERC1155: protocol === "ERC1155", quantity: quantity || '1' });
      }

      return txResult;
    }
  );
}
