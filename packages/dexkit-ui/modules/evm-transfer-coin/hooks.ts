import { ChainId, CoinTypes } from '@dexkit/core/constants';
import { NETWORK_PROVIDER } from '@dexkit/core/constants/networkProvider';
import { Coin, EvmCoin } from '@dexkit/core/types';
import { client } from '@dexkit/wallet-connectors/thirdweb/client';
import { useMutation } from '@tanstack/react-query';
import { getContract, sendTransaction } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { transfer } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { parseUnits } from 'viem';

export function useEvmTransferMutation({
  onSubmit,
  onConfirm,
}: {

  onSubmit?: (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    }
  ) => void;
  onConfirm?: (
    hash: string,
    params: {
      address: string;
      amount: number;
      coin: Coin;
    }
  ) => void;
}) {
  const activeAccount = useActiveAccount();


  return useMutation(
    async (params: { coin: EvmCoin; amount: number; address: string, chainId: number }) => {
      const { coin, amount, address, chainId } = params;



      if (!activeAccount) {
        throw new Error('no address set');
      }


      let toAddress: string | null = address;
      if (address.split('.').length > 1) {
        const networkProvider = NETWORK_PROVIDER(ChainId.Ethereum)
        if (networkProvider) {
          toAddress = await networkProvider.resolveName(address);
        }

      }

      if (!toAddress) {
        throw new Error('no address set');
      }

      if (coin.coinType === CoinTypes.EVM_ERC20) {
        // get a contract
        const contract = getContract({
          // the client you have created via `createThirdwebClient()`
          client,
          // the chain the contract is deployed on
          chain: defineChain(chainId),
          // the contract's address
          address: coin.contractAddress,
        });


        const transaction = await transfer({
          contract,
          to: toAddress,
          amount: amount
        });

        const tx = await sendTransaction({ transaction, account: activeAccount });


        if (onSubmit) {
          onSubmit(tx.transactionHash, params);
        }

        if (onConfirm) {
          onConfirm(tx.transactionHash, params);
        }
        return tx.transactionHash;
      }

      if (coin.coinType === CoinTypes.EVM_NATIVE) {


        const tx = await activeAccount.sendTransaction({
          to: toAddress,
          value: parseUnits(amount.toString(), coin.decimals),
          chainId
        })



        if (onSubmit) {
          onSubmit(tx.transactionHash, params);
        }

        if (onConfirm) {
          onConfirm(tx.transactionHash, params);
        }

        return tx.transactionHash;
      }
    }
  );
}
