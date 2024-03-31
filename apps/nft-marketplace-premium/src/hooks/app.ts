import { ThemeMode } from '@dexkit/ui/constants/enum';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAtom } from 'jotai';
import { useContext, useMemo } from 'react';
import { AppConfigContext } from '../contexts';
import { userThemeModeAtom } from '../state/atoms';

import { useConnectWalletDialog as useConnectWalletDialogV2 } from '@dexkit/ui/hooks';
import { useQuery } from '@tanstack/react-query';
import { getProtectedAppConfig } from 'src/services/whitelabel';
import { useAuth } from './account';



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

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

export function useThemeMode() {
  const systemPrefersDark = useMediaQuery(DARK_SCHEME_QUERY);
  const [userMode, setThemeMode] = useAtom(userThemeModeAtom);
  const appConfig = useAppConfig();

  const mode = useMemo(() => {
    if (userMode) {
      return userMode;
    }
    if (appConfig.defaultThemeMode) {
      return appConfig.defaultThemeMode;
    }
    return systemPrefersDark ? ThemeMode.dark : ThemeMode.light;
  }, [userMode, appConfig, systemPrefersDark]);

  return { mode: mode, setThemeMode, userMode };
}


