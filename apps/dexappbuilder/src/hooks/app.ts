import { useContext } from 'react';
import { AppConfigContext } from '../contexts';

import { useAuth, useConnectWalletDialog as useConnectWalletDialogV2 } from '@dexkit/ui/hooks';
import { useQuery } from '@tanstack/react-query';
import { getProtectedAppConfig } from 'src/services/whitelabel';
import { useSiteId } from './app/useSiteId';
import { useAppConfig } from './app/useAppConfig';
import { useThemeMode } from './app/useThemeMode';
// const isConnectWalletOpenAtom = atom(false);

// export function useConnectWalletDialog() {
//   const [isOpen, setOpen] = useAtom(isConnectWalletOpenAtom);

//   return {
//     isOpen,
//     setOpen,
//   };
// }

export { useSiteId, useAppConfig, useThemeMode };

export function useConnectWalletDialog() {
  return useConnectWalletDialogV2();
}



const PROTECTED_CONFIG_QUERY = 'PROTECTED_CONFIG_QUERY'

export function useProtectedAppConfig({ isProtected, domain, page, slug, result }: { isProtected: boolean, domain?: string, page: string, slug?: string, result?: boolean }) {
  const { isLoggedIn } = useAuth()

  return useQuery([PROTECTED_CONFIG_QUERY, isProtected, domain, page, isLoggedIn, slug, result], async () => {
    if (isProtected && isLoggedIn && result) {
      return await getProtectedAppConfig({ domain, appPage: page, slug })
    }
  });
}

export function useAppNFT() {
  return useContext(AppConfigContext).appNFT;
}


export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}





