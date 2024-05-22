import {
  UseMutationOptions,
  useMutation
} from "@tanstack/react-query";


import type { providers } from 'ethers';
import { BigNumber, Contract } from "ethers";
import { ERC20Abi } from "../../constants/abis";



import { Token } from "@dexkit/core/types";
import { NotificationCallbackParams } from "./types";


export function useErc20ApproveMutation({
  options,
  onNotification,
}: {
  options?: Omit<UseMutationOptions, any>;
  onNotification: (params: NotificationCallbackParams) => void;
}) {
  const mutation = useMutation(
    async ({
      spender,
      amount,
      tokenAddress,
      provider,
      token,
    }: {
      spender: string;
      token: Token;
      amount: BigNumber;
      tokenAddress?: string;
      provider?: providers.Web3Provider;
    }) => {
      if (!provider || tokenAddress === undefined) {
        return undefined;
      }

      const contract = new Contract(
        tokenAddress,
        ERC20Abi,
        provider.getSigner()
      );

      const tx = await contract.approve(spender, amount);

      const chainId = (await provider.getNetwork()).chainId;

      onNotification({
        chainId,
        title: "Approve token",
        hash: tx.hash,
        params: {
          type: "approve",
          token,
        },
      });

      return await tx.wait();
    },
    options
  );

  return mutation;
}

