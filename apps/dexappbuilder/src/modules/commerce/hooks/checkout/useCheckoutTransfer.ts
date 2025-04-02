import { ERC20Abi } from '@dexkit/core/constants/abis';
import { Token } from '@dexkit/core/types';
import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import { useMutation } from '@tanstack/react-query';
import { getContract } from 'thirdweb';

import { useActiveWalletChain } from "thirdweb/react";
export default function useCheckoutTransfer() {
  const activeChain = useActiveWalletChain();

  return useMutation(
    async ({
      address,
      amount,
      token,
      onSubmit,
    }: {
      address: string;
      amount: bigint;
      token?: Token;
      onSubmit: (hash: string) => void;
    }) => {
      if (token) {
        const contract = getContract({
          client,
          chain: activeChain ? activeChain : undefined,
          address: token.address,
          // optional ABI
          abi: ERC20Abi,
        });

        const tx = await contract.transfer(address, amount);


        onSubmit(tx.hash);

        return await tx.wait();
      }
    },
  );
}
