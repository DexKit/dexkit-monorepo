import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useMutation } from "@tanstack/react-query";
import { useContract } from "@thirdweb-dev/react";

export function useMintToken({
  contractAddress,
  onSubmit,
}: {
  contractAddress?: string;
  onSubmit?: (
    hash: string,
    quantity: string,
    name: string,
    symbol: string,
    to: string,
  ) => void;
}) {
  const { account } = useWeb3React();
  const { data: contract } = useContract(contractAddress, "token");

  return useMutation(
    async ({ quantity, to }: { quantity?: string; to?: string }) => {
      if (!contractAddress || !quantity) {
        return false;
      }

      let tx;

      if (to) {
        tx = await contract?.erc20.mintTo.prepare(to, quantity);
      } else {
        tx = await contract?.erc20.mint.prepare(quantity);
      }

      const sentTx = await tx?.send();

      const meta = await contract?.erc20.get();

      if (onSubmit && sentTx && meta) {
        onSubmit(
          sentTx.hash,
          quantity,
          meta.name,
          meta.symbol,
          (to || account) as string,
        );
      }
      if (sentTx) {
        return await sentTx.wait();
      }

      return sentTx;
    },
  );
}
