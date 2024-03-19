import { ChainId } from "@dexkit/core/constants";
import { ERC1155Abi, ERC721Abi } from "@dexkit/core/constants/abis";
import { NETWORK_PROVIDER } from "@dexkit/core/constants/networks";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";

export function useNftTransfer({
  contractAddress,
  provider,
  onSubmit,
  onConfirm,
}: {
  contractAddress?: string;
  tokenId?: string;
  provider?: ethers.providers.Web3Provider;
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
        !provider ||
        (protocol === "ERC1155" && !quantity)
      ) {
        return false;
      }

      let contract = new ethers.Contract(
        contractAddress,
        protocol === "ERC1155" ? ERC1155Abi : ERC721Abi,
        provider?.getSigner()
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
