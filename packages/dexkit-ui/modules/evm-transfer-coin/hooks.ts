import { ChainId, CoinTypes } from "@dexkit/core/constants";
import { ERC20Abi } from "@dexkit/core/constants/abis";
import { NETWORK_PROVIDER } from "@dexkit/core/constants/networkProvider";
import { Coin, EvmCoin } from "@dexkit/core/types";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { useMutation } from "@tanstack/react-query";
import type { providers } from "ethers";
import { Contract } from "ethers";

export function useEvmTransferMutation({
  provider,
  onSubmit,
  onConfirm,
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
  onConfirm?: (
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
        throw new Error("no provider");
      }
      let toAddress: string | null = address;
      if (address.split(".").length > 1) {
        const networkProvider = NETWORK_PROVIDER(ChainId.Ethereum);
        if (networkProvider) {
          toAddress = await networkProvider.resolveName(address);
        }
      }

      if (!toAddress) {
        throw new Error("no address set");
      }

      if (coin.coinType === CoinTypes.EVM_ERC20) {
        const contract = new Contract(
          coin.contractAddress,
          ERC20Abi,
          provider.getSigner(),
        );

        const tx = await contract.transfer(
          toAddress,
          parseUnits(amount.toString(), coin.decimals),
        );

        if (onSubmit) {
          onSubmit(tx.hash, params);
        }

        const txResult = await tx.wait();
        if (onConfirm) {
          onConfirm(tx.hash, params);
        }
        return txResult;
      }

      if (coin.coinType === CoinTypes.EVM_NATIVE) {
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
          to: toAddress,
          value: parseUnits(amount.toString(), coin.decimals),
        });

        if (onSubmit) {
          onSubmit(tx.hash, params);
        }

        const txResult = await tx.wait();
        if (onConfirm) {
          onConfirm(tx.hash, params);
        }

        return txResult;
      }
    },
  );
}
