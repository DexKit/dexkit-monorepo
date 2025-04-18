import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
  useQuery
} from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';

export function useBlockNumber() {
  const { provider } = useWeb3React();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    if (provider) {
      const handleBlockNumber = (blockNumber: any) => {
        setBlockNumber(blockNumber);
      };

      provider?.on('block', handleBlockNumber);

      return () => {
        provider?.removeListener('block', handleBlockNumber);
      };
    }
  }, [provider]);

  return blockNumber;
}





const EVM_NATIVE_BALANCE_QUERY = 'EVM_NATIVE_BALANCE_QUERY';

export function useEvmNativeBalance({
  provider,
  account,
}: {
  account?: string;
  provider?: ethers.providers.Web3Provider;
}) {
  return useQuery([EVM_NATIVE_BALANCE_QUERY, account], async () => {
    if (!account || !provider) {
      return BigNumber.from(0);
    }

    return (await provider.getBalance(account)) || BigNumber.from(0);
  });
}
