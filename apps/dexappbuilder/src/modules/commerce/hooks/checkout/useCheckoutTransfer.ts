import { ChainId } from '@dexkit/core';
import { ERC20Abi } from '@dexkit/core/constants/abis';
import { Token } from '@dexkit/core/types';
import { useJsonRpcProvider } from '@dexkit/ui/modules/wizard/hooks';
import { useMutation } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';

export default function useCheckoutTransfer() {
  const { data: provider } = useJsonRpcProvider({ chainId: ChainId.Ethereum });

  return useMutation(
    async ({
      address,
      amount,
      token,
      onSubmit,
    }: {
      address: string;
      amount: BigNumber;
      token?: Token;
      onSubmit: (hash: string) => void;
    }) => {
      if (token) {
        const contract = new ethers.Contract(
          token?.address,
          ERC20Abi,
          provider?.getSigner(),
        );

        const tx = await contract.transfer(address, amount);

        onSubmit(tx.hash);

        return await tx.wait();
      }
    },
  );
}
