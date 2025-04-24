import { useContext } from 'react';
import { AppConfigContext } from '../contexts';

import { useAuth, useConnectWalletDialog as useConnectWalletDialogV2, useThemeMode as useThemeModeUI } from '@dexkit/ui/hooks';
import { useQuery } from '@tanstack/react-query';
import { getProtectedAppConfig } from 'src/services/whitelabel';



// const isConnectWalletOpenAtom = atom(false);

// export function useConnectWalletDialog() {
//   const [isOpen, setOpen] = useAtom(isConnectWalletOpenAtom);

//   return {
//     isOpen,
//     setOpen,
//   };
// }

export function useConnectWalletDialog() {
  return useConnectWalletDialogV2();
}

// App config context is passed on _app.tsx, in each page we need to pass
// app config in static props to context be initialized
export function useAppConfig() {
  return useContext(AppConfigContext).appConfig;
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
/**
 * Site id from active app. If is DexAppBuilder this will return null
 * @returns 
 */
export function useSiteId() {
  return useContext(AppConfigContext).siteId;
}

export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}


export function useThemeMode() {
  const { mode, userMode, setThemeMode } = useThemeModeUI()

  return { mode, userMode, setThemeMode };
}


