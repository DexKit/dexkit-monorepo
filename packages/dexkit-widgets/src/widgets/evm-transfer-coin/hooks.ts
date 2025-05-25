
import { CoinTypes } from '@dexkit/core/constants';
import { ERC20Abi } from '@dexkit/core/constants/abis';
import { Coin, EvmCoin } from '@dexkit/core/types';
import { parseUnits } from '@dexkit/core/utils/ethers/parseUnits';
import { useMutation } from '@tanstack/react-query';
import { Contract, providers } from 'ethers';


export function useEvmTransferMutation({
  signer,
  onSubmit,
}: {
  signer?: providers.JsonRpcSigner;
  onSubmit?: (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    }
  ) => void;
}) {
  return useMutation(
    async (params: { coin: EvmCoin; amount: number; address: string }) => {
      const { coin, amount, address } = params;

      if (!signer) {
        return;
      }

      if (coin.coinType === CoinTypes.EVM_ERC20) {
        const contract = new Contract(
          coin.contractAddress,
          ERC20Abi,
          signer
        );

        const tx = await contract.transfer(
          address,
          parseUnits(amount.toString(), coin.decimals)
        );

        if (onSubmit) {
          onSubmit(tx.hash, params);
        }

        return await tx.wait();
      }
    }
  );
}

