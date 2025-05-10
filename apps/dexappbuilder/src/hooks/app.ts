import { useContext } from 'react';
import { AppConfigContext } from '../contexts';

import { useAuth, useConnectWalletDialog as useConnectWalletDialogV2 } from '@dexkit/ui/hooks';
import { useQuery } from '@tanstack/react-query';
import { getProtectedAppConfig } from 'src/services/whitelabel';
import { useAppConfig } from './app/useAppConfig';
import { useSiteId } from './app/useSiteId';
import { useThemeMode } from './app/useThemeMode';
// const isConnectWalletOpenAtom = atom(false);

// export function useConnectWalletDialog() {
//   const [isOpen, setOpen] = useAtom(isConnectWalletOpenAtom);

//   return {
//     isOpen,
//     setOpen,
//   };
// }

export { useAppConfig, useSiteId, useThemeMode };

export function useConnectWalletDialog() {
  return useConnectWalletDialogV2();
}



const PROTECTED_CONFIG_QUERY = 'PROTECTED_CONFIG_QUERY'

export function useProtectedAppConfig({ isProtected, domain, page, slug, result }: { isProtected: boolean, domain?: string, page: string, slug?: string, result?: boolean }) {
  const { isLoggedIn } = useAuth()

  return useQuery(
    [PROTECTED_CONFIG_QUERY, isProtected, domain, page, isLoggedIn, slug, result],
    async () => {
      
      if (isProtected && isLoggedIn) {
        
        if (result === true) {
          try {
            const response = await getProtectedAppConfig({ domain, appPage: page, slug });
            return response.data;
          } catch (error) {
            console.error("Error fetching protected content:", error);
            throw error;
          }
        }
      }
      return null;
    },
    {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: true,
      meta: {
        debugLabel: 'ProtectedConfig',
      },
    }
  );
}

export function useAppNFT() {
  return useContext(AppConfigContext).appNFT;
}


export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}





