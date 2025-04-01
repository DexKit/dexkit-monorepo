import { useMutation } from "@tanstack/react-query";
import { useContract } from "@thirdweb-dev/react";

export function useSetAllowanceToken({
  contractAddress,
  onSubmit,
}: {
  contractAddress?: string;
  onSubmit?: (
    hash: string,
    quantity: string,
    spender: string,
    name: string,
    symbol: string,
  ) => void;
}) {
  const { data: contract } = useContract(contractAddress, "token");

  return useMutation(
    async ({ quantity, spender }: { quantity?: string; spender?: string }) => {
      if (!contractAddress || !quantity || !spender) {
        return false;
      }

      let tx = await contract?.erc20.setAllowance.prepare(spender, quantity);

      const sentTx = await tx?.send();

      const meta = await contract?.erc20.get();

      if (onSubmit && sentTx && meta) {
        onSubmit(sentTx.hash, quantity, spender, meta.name, meta.symbol);
      }
      if (sentTx) {
        return await sentTx.wait();
      }

      return sentTx;
    },
  );
}
