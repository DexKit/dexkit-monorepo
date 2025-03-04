import { ChainId } from '@dexkit/core';
import { useTokenDataQuery } from '@dexkit/ui';
import React from 'react';

export interface TokenDataContainerProps {
  contractAddress: string;
  chainId: ChainId;
  children: (data: {
    decimals?: number;
    name?: string;
    symbol?: string;
  }) => React.ReactNode;
}
export default function TokenDataContainer({
  contractAddress,
  chainId,
  children,
}: TokenDataContainerProps) {
  const { data: tokenData } = useTokenDataQuery({
    address: contractAddress,
    chainId: chainId,
  });

  return children({
    decimals: tokenData?.decimals,
    name: tokenData?.name,
    symbol: tokenData?.symbol,
  });
}
