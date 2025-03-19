import { useMutation } from "@tanstack/react-query";
import { useContract } from "@thirdweb-dev/react";

export function useNftBurn({
  contractAddress,
  onSubmit,
}: {
  contractAddress?: string;
  onSubmit?: (hash: string, quantity?: string) => void;
}) {
  const { data: contract } = useContract(contractAddress);

  return useMutation(
    async ({
      tokenId,
      protocol,
      quantity,
    }: {
      protocol?: "ERC721" | "ERC1155";
      tokenId: string;
      quantity?: string;
    }) => {
      if (
        !contractAddress ||
        !tokenId ||
        (protocol === "ERC1155" && !quantity)
      ) {
        return false;
      }

      let tx;
      if (protocol === "ERC1155" && quantity) {
        tx = await contract?.erc1155.burn.prepare(tokenId, quantity);
      } else {
        tx = await contract?.erc721.burn.prepare(tokenId);
      }
      const sentTx = await tx?.send();

      if (onSubmit && sentTx) {
        onSubmit(sentTx.hash, quantity);
      }
      if (sentTx) {
        return await sentTx.wait();
      }

      return sentTx;
    },
  );
}

export function useBurnToken({
  contractAddress,
  onSubmit,
}: {
  contractAddress?: string;
  onSubmit?: (
    hash: string,
    quantity: string,
    name: string,
    symbol: string,
  ) => void;
}) {
  const { data: contract } = useContract(contractAddress, "token");

  return useMutation(async ({ quantity }: { quantity?: string }) => {
    if (!contractAddress || !quantity) {
      return false;
    }

    let tx = await contract?.erc20.burn.prepare(quantity);

    const sentTx = await tx?.send();

    const meta = await contract?.erc20.get();

    if (onSubmit && sentTx && meta) {
      onSubmit(sentTx.hash, quantity, meta.name, meta.symbol);
    }
    if (sentTx) {
      return await sentTx.wait();
    }

    return sentTx;
  });
}
