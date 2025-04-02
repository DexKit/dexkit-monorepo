import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { useDexKitContext } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useMutation } from '@tanstack/react-query';
import { useContractMetadata } from '@thirdweb-dev/react';
import { SmartContract, Token } from '@thirdweb-dev/sdk';
import { BigNumber } from 'ethers';

export function useWithdrawRewardsMutation({
  contract,
  rewardDecimals,
}: {
  contract?: SmartContract;
  rewardDecimals?: number;
}) {
  const { data: metadata } = useContractMetadata(contract);

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const { chainId } = useWeb3React();

  return useMutation(async ({ amount }: { amount: bigint }) => {
    let values = {
      amount: formatUnits(amount, rewardDecimals),
      contractName: metadata?.name || '',
    };

    watchTransactionDialog.open('withdrawRewards', values);

    const call = await contract?.call('withdrawRewardTokens', [amount]);

    let tx = await call.send();

    if (tx.hash && chainId) {
      createNotification({
        type: 'transaction',
        subtype: 'withdrawRewards',
        values,
        metadata: { hash: tx.hash, chainId },
      });

      watchTransactionDialog.watch(tx.hash);
    }
  });
}

export function useDepositRewardTokensMutation({
  contract,
  rewardDecimals,
}: {
  contract?: SmartContract;
  rewardDecimals?: number;
}) {
  const { data: metadata } = useContractMetadata(contract);

  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const { chainId } = useWeb3React();

  return useMutation(async ({ amount }: { amount: BigNumber }) => {
    let values = {
      amount: formatUnits(amount, rewardDecimals),
      contractName: metadata?.name || '',
    };

    watchTransactionDialog.open('depositRewardTokens', values);

    const call = await contract?.call('depositRewardTokens', [amount]);

    let tx = await call.send();

    if (tx.hash && chainId) {
      createNotification({
        type: 'transaction',
        subtype: 'depositRewardTokens',
        values,
        metadata: { hash: tx.hash, chainId },
      });

      watchTransactionDialog.watch(tx.hash);
    }
  });
}

export function useThirdwebApprove({
  contract,
  address,
}: {
  contract?: Token;
  address?: string;
}) {
  const { watchTransactionDialog, createNotification } = useDexKitContext();

  const { chainId } = useWeb3React();

  return useMutation(async ({ amount }: { amount: string }) => {
    if (address) {
      const metadata = await contract?.metadata.get();

      let values = {
        name: metadata?.name || '',
        symbol: metadata?.symbol || '',
      };

      watchTransactionDialog.open('approve', values);

      let call = await contract?.erc20.setAllowance.prepare(address, amount);

      try {
        let tx = await call?.send();

        if (tx?.hash && chainId) {
          createNotification({
            type: 'transaction',
            subtype: 'approve',
            values,
            metadata: { hash: tx.hash, chainId },
          });
          watchTransactionDialog.watch(tx.hash);
        }

        return await tx?.wait();
      } catch (err) {
        watchTransactionDialog.setError(err as any);
      }

      watchTransactionDialog.close();

      return null;
    }

    return null;
  });
}

export function useSetRewardsPerUnitTime({
  contract,
  isEdition,
}: {
  contract?: SmartContract;
  isEdition?: boolean;
}) {
  const { watchTransactionDialog, createNotification } = useDexKitContext();
  const { chainId } = useWeb3React();

  return useMutation(async ({ unitTime }: { unitTime: string }) => {
    const metadata = await contract?.metadata.get();

    const values = { amount: unitTime, contractName: metadata?.name || '' };

    watchTransactionDialog.open('setRewardPerUnitTime', values);

    const call = contract?.prepare(isEdition ? 'setDefaultRewardsPerUnitTime' : 'setRewardsPerUnitTime', [unitTime]);

    try {
      let tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'setRewardPerUnitTime',
          values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      return await tx?.wait();
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
    return null;
  });
}

export function useSetDefaultTimeUnit({
  contract,
  isAltVersion,
}: {
  contract?: SmartContract;
  isAltVersion?: boolean;
}) {
  const { watchTransactionDialog, createNotification } = useDexKitContext();
  const { chainId } = useWeb3React();

  return useMutation(async ({ timeUnit }: { timeUnit: string }) => {
    const metadata = await contract?.metadata.get();

    const values = { amount: timeUnit, contractName: metadata?.name || '' };

    watchTransactionDialog.open('setDefaultTimeUnit', values);

    const call = contract?.prepare(
      isAltVersion ? 'setTimeUnit' : 'setDefaultTimeUnit',
      [timeUnit],
    );

    try {
      let tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'setDefaultTimeUnit',
          values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      return await tx?.wait();
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
    return null;
  });
}

export function useSetRewardRatio({ contract }: { contract?: SmartContract }) {
  const { watchTransactionDialog, createNotification } = useDexKitContext();
  const { chainId } = useWeb3React();

  return useMutation(
    async ({
      numerator,
      denominator,
    }: {
      numerator: string;
      denominator: string;
    }) => {
      const metadata = await contract?.metadata.get();

      const values = {
        numerator: numerator,
        denominator: numerator,
        contractName: metadata?.name || '',
      };

      watchTransactionDialog.open('setRewardRatio', values);

      const call = contract?.prepare('setRewardRatio', [
        numerator,
        denominator,
      ]);

      try {
        let tx = await call?.send();

        if (tx?.hash && chainId) {
          createNotification({
            type: 'transaction',
            subtype: 'setDefaultTimeUnit',
            values,
            metadata: { hash: tx.hash, chainId },
          });

          watchTransactionDialog.watch(tx.hash);
        }

        return await tx?.wait();
      } catch (err) {
        watchTransactionDialog.setError(err as any);
      }
      return null;
    },
  );
}

export function useApproveForAll({
  contract,
  address,
}: {
  contract?: SmartContract;
  address?: string;
}) {
  const { watchTransactionDialog, createNotification } = useDexKitContext();
  const { chainId } = useWeb3React();

  return useMutation(async () => {
    const metadata = await contract?.metadata.get();

    const values = {
      name: metadata?.name || '',
    };

    // Do not remove this "await". The IDE show this line as a non-async function, but it's not.
    const call = await contract?.prepare('setApprovalForAll', [address, true]);

    watchTransactionDialog.open('approveContracForAllNfts', values);

    try {
      const tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'approveContracForAllNfts',
          values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      return await tx?.wait();
    } catch (err) {
      watchTransactionDialog.setError(err as any);
    }
  });
}
