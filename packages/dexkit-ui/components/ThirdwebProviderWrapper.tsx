/* import { ThirdwebSDKProvider } from '@thirdweb-dev/react';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { ReactNode } from 'react';
import { THIRDWEB_CLIENT_ID } from '../constants/thirdweb';

interface Props {
  children: ReactNode;
  activeChain?: number;
  signer?: any;
  clientId?: string;
}

export function ThirdwebProviderWrapper({
  children,
  activeChain,
  signer,
  clientId = THIRDWEB_CLIENT_ID
}: Props) {
  return (
    <ThirdwebSDKProvider
      clientId={clientId}
      activeChain={activeChain}
      signer={signer}
      storageInterface={new ThirdwebStorage({
        clientId: clientId,
      })}
    >
      {children}
    </ThirdwebSDKProvider>
  );
}  */