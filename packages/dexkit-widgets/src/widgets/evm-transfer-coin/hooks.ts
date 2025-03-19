import { CoinTypes } from "@dexkit/core/constants";
import { ERC20Abi } from "@dexkit/core/constants/abis";
import { Coin, EvmCoin } from "@dexkit/core/types";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { useMutation } from "@tanstack/react-query";
import { Contract, providers } from "ethers";

export function useEvmTransferMutation({
  provider,
  onSubmit,
}: {
  provider?: providers.Web3Provider;
  onSubmit?: (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    },
  ) => void;
}) {
  return useMutation(
    async (params: { coin: EvmCoin; amount: number; address: string }) => {
      const { coin, amount, address } = params;

      if (!provider) {
        return;
      }

      if (coin.coinType === CoinTypes.EVM_ERC20) {
        const contract = new Contract(
          coin.contractAddress,
          ERC20Abi,
          provider.getSigner(),
        );

        const tx = await contract.transfer(
          address,
          parseUnits(amount.toString(), coin.decimals),
        );

        if (onSubmit) {
          onSubmit(tx.hash, params);
        }

        return await tx.wait();
      }
    },
  );
}
