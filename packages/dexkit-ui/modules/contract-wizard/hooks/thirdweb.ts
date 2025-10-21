import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { useDexKitContext } from '@dexkit/ui';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import { useMutation } from '@tanstack/react-query';
import { useContractMetadata } from '@thirdweb-dev/react';
import { SmartContract, Token } from '@thirdweb-dev/sdk';
import { BigNumber, ethers } from 'ethers';

export const formatTransactionError = (errorMessage: string): string => {
  if (errorMessage.includes('user denied') || errorMessage.includes('User denied') ||
    errorMessage.includes('rejected transaction') || errorMessage.includes('user rejected') ||
    errorMessage.includes('User denied transaction signature') ||
    errorMessage.includes('MetaMask Tx Signature: User den')) {
    return 'Transaction was cancelled by user.';
  }

  if (errorMessage.includes('MetaMask Tx Signature')) {
    return 'Transaction was cancelled by user.';
  }

  if (errorMessage.includes('TRANSACTION ERROR') || errorMessage.includes('TRANSACTION INFORMATION')) {
    if (errorMessage.includes('User denied transaction signature')) {
      return 'Transaction was cancelled by user.';
    } else {
      const reasonMatch = errorMessage.match(/Reason: (.+?)(?=\s*╔|$)/);
      if (reasonMatch) {
        const reason = reasonMatch[1].trim();
        if (reason.includes('User denied') || reason.includes('user denied')) {
          return 'Transaction was cancelled by user.';
        }
        return reason;
      }
      return 'Transaction failed. Please try again.';
    }
  }

  if (errorMessage.includes('IPFS') || errorMessage.includes('timed out')) {
    return 'Network timeout. The network might be congested. Please try again.';
  }

  if (errorMessage.includes('insufficient funds') || errorMessage.includes('Insufficient funds')) {
    return 'Insufficient funds to complete the transaction.';
  }

  if (errorMessage.includes('gas') && errorMessage.includes('estimate')) {
    return 'Unable to estimate gas. Please try again or increase gas limit.';
  }

  if (errorMessage.includes('execution reverted')) {
    return 'Transaction failed. The contract execution was reverted.';
  }

  return errorMessage;
};

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

  return useMutation(async ({ amount }: { amount: BigNumber }) => {
    let values = {
      amount: formatUnits(amount, rewardDecimals),
      contractName: metadata?.name || '',
    };

    watchTransactionDialog.open('withdrawRewards', values);

    try {
      if (!contract) {
        throw new Error('Could not access the contract');
      }

      const call = contract.prepare('withdrawRewardTokens', [amount]);

      if (!call) {
        throw new Error('Could not prepare the transaction');
      }

      const tx = await call.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'withdrawRewards',
          values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      return await tx?.wait();
    } catch (err: any) {
      console.error('Error in withdrawal of rewards:', err.message || err);
      let errorMessage = err.message || 'Unknown error during withdrawal';

      errorMessage = formatTransactionError(errorMessage);

      watchTransactionDialog.setError(new Error(errorMessage));
    } finally {
    }

    return null;
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
  const { chainId, provider } = useWeb3React();

  return useMutation(async ({ amount }: { amount: BigNumber }) => {
    let tokenName = '';
    let tokenSymbol = '';
    let contractName = '';

    try {
      if (metadata?.name) {
        contractName = metadata.name;
      }
      else if (contract) {
        try {
          const contractInfo = await contract.call('name', []);
          if (contractInfo && typeof contractInfo === 'string') {
            contractName = contractInfo;
          }
        } catch (nameError) {
          console.warn('Error getting contract name:', nameError);
        }
      }

      if (!contractName) {
        contractName = 'Staking Contract';
      }

      const rewardTokenAddress = await contract?.call('rewardToken', []);

      if (rewardTokenAddress && provider) {
        try {
          const tokenContract = new ethers.Contract(
            rewardTokenAddress,
            ['function name() view returns (string)', 'function symbol() view returns (string)'],
            provider
          );

          tokenName = await tokenContract.name();
          tokenSymbol = await tokenContract.symbol();
        } catch (tokenError) {
          console.warn('Error getting token information:', tokenError);
        }
      }
    } catch (contractError) {
      console.warn('Error getting reward token address:', contractError);
    }

    let values = {
      amount: formatUnits(amount, rewardDecimals),
      contractName: contractName,
      name: tokenName || 'Token',
      symbol: tokenSymbol || 'Tokens',
    };

    watchTransactionDialog.open('depositRewards', values);

    try {
      if (!contract) {
        throw new Error('Could not access the contract');
      }

      const call = await contract.prepare('depositRewardTokens', [amount]);

      if (!call) {
        throw new Error('Could not prepare the transaction');
      }

      const tx = await call.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'depositRewards',
          values,
          metadata: { hash: tx.hash, chainId },
        });

        watchTransactionDialog.watch(tx.hash);
      }

      return await tx?.wait();
    } catch (err: any) {
      console.error('Error in deposit of rewards:', err.message || err);
      let errorMessage = err.message || 'Unknown error during deposit';

      if (errorMessage.includes('insufficient allowance')) {
        errorMessage = 'Insufficient allowance. Please approve tokens first.';

        watchTransactionDialog.close();

        return {
          success: false,
          requiresApproval: true,
          message: 'Additional approval required'
        };
      }

      errorMessage = formatTransactionError(errorMessage);

      watchTransactionDialog.setError(new Error(errorMessage));
    } finally {
    }

    return null;
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
    if (!address || !contract) {
      return null;
    }

    let metadata: any = { name: '', symbol: '' };

    try {
      try {
        const tokenInfo = await contract.get();
        if (tokenInfo) {
          metadata = {
            name: tokenInfo.name || '',
            symbol: tokenInfo.symbol || '',
          };
        }
      } catch (tokenError) {
        console.warn('Error in getting basic token information:', tokenError);
      }

      if (!metadata.name && !metadata.symbol) {
        const metadataPromise = contract?.metadata.get();
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout in getting contract metadata.'));
          }, 10000);
        });

        metadata = await Promise.race([metadataPromise, timeoutPromise])
          .catch(error => {
            console.warn('Error in getting metadata:', error.message);
            return { name: 'ERC20', symbol: 'Tokens' };
          });
      }
    } catch (error) {
      console.warn('Error in getting contract metadata:', error);
      metadata = { name: 'ERC20', symbol: 'Tokens' };
    }

    let values = {
      name: metadata?.name || 'ERC20',
      symbol: metadata?.symbol || 'Tokens',
    };

    let currentAllowance = BigNumber.from(0);
    try {
      const allowance = await contract.allowance(address);
      currentAllowance = BigNumber.from(allowance.value);

      if (currentAllowance.gte(BigNumber.from(amount))) {
        return { success: true, message: 'Sufficient approval already exists' };
      }
    } catch (error) {
      console.warn('Error in checking existing allowance:', error);
    }

    const safeMaxApprovalAmount = "115792089237316195423570985008687907853269984665640564039457000000000000000000";

    watchTransactionDialog.open('approve', values);

    try {
      const call = await contract.erc20.setAllowance.prepare(address, safeMaxApprovalAmount);

      if (!call) {
        throw new Error('Could not prepare the approval transaction');
      }

      const tx = await call.send();

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
    } catch (err: any) {
      console.error('Error in approval:', err.message || err);
      let errorMessage = err.message || 'Unknown error during approval';

      if (errorMessage.includes('out-of-bounds') || errorMessage.includes('overflow')) {
        try {
          const smallerApprovalAmount = "1000000000000000000000000000000000000";
          const newCall = await contract.erc20.setAllowance.prepare(address, smallerApprovalAmount);
          const newTx = await newCall.send();

          if (newTx?.hash && chainId) {
            createNotification({
              type: 'transaction',
              subtype: 'approve',
              values,
              metadata: { hash: newTx.hash, chainId },
            });
            watchTransactionDialog.watch(newTx.hash);
          }

          return await newTx?.wait();
        } catch (retryErr: any) {
          console.error('Error in second attempt of approval:', retryErr.message || retryErr);
          errorMessage = 'Error in approving the tokens. Please try with a smaller amount.';
          watchTransactionDialog.setError(new Error(errorMessage));
          return null;
        }
      }

      errorMessage = formatTransactionError(errorMessage);

      watchTransactionDialog.setError(new Error(errorMessage));
    } finally {
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
    let metadata: any = { name: '' };

    try {
      try {
        const contractInfo = await contract?.call('name', []);
        if (contractInfo && typeof contractInfo === 'string') {
          metadata = { name: contractInfo };
        }
      } catch (nameError) {
        console.warn('Error in getting contract name:', nameError);
      }

      if (!metadata.name) {
        const metadataPromise = contract?.metadata.get();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout in getting contract metadata.'));
          }, 10000);
        });

        metadata = await Promise.race([metadataPromise, timeoutPromise])
          .catch(error => {
            console.warn('Error in getting metadata:', error.message);
            return { name: 'Staking Contract' };
          });
      }
    } catch (error) {
      console.warn('Error in getting contract metadata:', error);
      metadata = { name: 'Staking Contract' };
    }

    const values = { amount: unitTime, contractName: metadata?.name || 'Staking Contract' };

    watchTransactionDialog.open('setRewardPerUnitTime', values);

    try {
      const call = contract?.prepare(isEdition ? 'setDefaultRewardsPerUnitTime' : 'setRewardsPerUnitTime', [unitTime]);

      if (!call) {
        throw new Error('Could not prepare the transaction');
      }

      let tx = await call.send();

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
    } catch (err: any) {
      console.error('Error in setting reward per unit time:', err.message || err);
      let errorMessage = err.message || 'Unknown error during operation';

      errorMessage = formatTransactionError(errorMessage);

      watchTransactionDialog.setError(new Error(errorMessage));
    } finally {
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
    let metadata: any = { name: '' };

    try {
      try {
        const contractInfo = await contract?.call('name', []);
        if (contractInfo && typeof contractInfo === 'string') {
          metadata = { name: contractInfo };
        }
      } catch (nameError) {
        console.warn('Error in getting contract name:', nameError);
      }

      if (!metadata.name) {
        const metadataPromise = contract?.metadata.get();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout in getting contract metadata.'));
          }, 10000);
        });

        metadata = await Promise.race([metadataPromise, timeoutPromise])
          .catch(error => {
            console.warn('Error in getting metadata:', error.message);
            return { name: 'Staking Contract' };
          });
      }
    } catch (error) {
      console.warn('Error in getting contract metadata:', error);
      metadata = { name: 'Staking Contract' };
    }

    const values = { amount: timeUnit, contractName: metadata?.name || 'Staking Contract' };

    watchTransactionDialog.open('setDefaultTimeUnit', values);

    try {
      const call = contract?.prepare(
        isAltVersion ? 'setTimeUnit' : 'setDefaultTimeUnit',
        [timeUnit],
      );

      if (!call) {
        throw new Error('Could not prepare the transaction');
      }

      let tx = await call.send();

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
    } catch (err: any) {
      console.error('Error in setting default time unit:', err.message || err);
      let errorMessage = err.message || 'Unknown error during operation';

      errorMessage = formatTransactionError(errorMessage);

      watchTransactionDialog.setError(new Error(errorMessage));
    } finally {
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
      let metadata: any = { name: '' };

      try {
        try {
          const contractInfo = await contract?.call('name', []);
          if (contractInfo && typeof contractInfo === 'string') {
            metadata = { name: contractInfo };
          }
        } catch (nameError) {
          console.warn('Error in getting contract name:', nameError);
        }

        if (!metadata.name) {
          const metadataPromise = contract?.metadata.get();
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Timeout in getting contract metadata.'));
            }, 10000);
          });

          metadata = await Promise.race([metadataPromise, timeoutPromise])
            .catch(error => {
              console.warn('Error in getting metadata:', error.message);
              return { name: 'Staking Contract' };
            });
        }
      } catch (error) {
        console.warn('Error in getting contract metadata:', error);
        metadata = { name: 'Staking Contract' };
      }

      const values = {
        numerator: numerator,
        denominator: denominator,
        contractName: metadata?.name || 'Staking Contract',
      };

      watchTransactionDialog.open('setRewardRatio', values);

      try {
        const call = contract?.prepare('setRewardRatio', [
          numerator,
          denominator,
        ]);

        if (!call) {
          throw new Error('Could not prepare the transaction');
        }

        let tx = await call.send();

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
      } catch (err: any) {
        console.error('Error in setting reward ratio:', err.message || err);
        let errorMessage = err.message || 'Unknown error during operation';

        errorMessage = formatTransactionError(errorMessage);

        watchTransactionDialog.setError(new Error(errorMessage));
      } finally {
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
    let metadata: any = { name: '' };

    try {
      try {
        const contractInfo = await contract?.call('name', []);
        if (contractInfo && typeof contractInfo === 'string') {
          metadata = { name: contractInfo };
        }
      } catch (nameError) {
        console.warn('Error in getting contract name:', nameError);
      }

      if (!metadata.name) {
        const metadataPromise = contract?.metadata.get();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout in getting contract metadata.'));
          }, 10000);
        });

        metadata = await Promise.race([metadataPromise, timeoutPromise])
          .catch(error => {
            console.warn('Error in getting metadata:', error.message);
            return { name: 'NFT Collection' };
          });
      }
    } catch (error) {
      console.warn('Error in getting contract metadata:', error);
      metadata = { name: 'NFT Collection' };
    }

    const values = {
      name: metadata?.name || 'NFT Collection',
    };

    watchTransactionDialog.open('approveContracForAllNfts', values);

    try {
      const call = await contract?.prepare('setApprovalForAll', [address, true]);

      if (!call) {
        throw new Error('Could not prepare the approval transaction');
      }

      const tx = await call.send();

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
    } catch (err: any) {
      console.error('Error in approval for all NFTs:', err.message || err);
      let errorMessage = err.message || 'Unknown error during approval';

      errorMessage = formatTransactionError(errorMessage);

      watchTransactionDialog.setError(new Error(errorMessage));
    } finally {
    }

    return null;
  });
}
