import { useWeb3React } from '@web3-react/core';
import dynamic from 'next/dynamic';

import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';

const EVMDarkblockWidget = dynamic(
  async () => (await import('@dexkit/darkblock-evm-widget')).EVMDarkblockWidget,
  { ssr: false },
);

export interface DarkBlockWrapperProps {
  address: string;
  tokenId?: string;
  network: string;
}

export default function DarkblockWrapper({
  address,
  tokenId,
  network,
}: DarkBlockWrapperProps) {
  const { provider, account } = useWeb3React();

  if (typeof window !== 'undefined') {
    if (
      network === 'polygon' ||
      network === 'ethereum' ||
      network === 'base' ||
      network === 'avalanche' ||
      network === 'mumbai' ||
      network === 'goerli'
    ) {
      return (
        <EVMDarkblockWidget
          contractAddress={address as string}
          chainId={NETWORK_FROM_SLUG(network)?.chainId}
          tokenId={tokenId}
          account={account}
          provider={provider?.provider}
          cb={() => {}}
        />
      );
    }
  }

  return null;
}
