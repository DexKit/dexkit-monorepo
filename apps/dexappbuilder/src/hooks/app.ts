import { useConnectWalletDialog as useConnectWalletDialogV2 } from '@dexkit/ui/hooks';
import { useAppConfig } from './app/useAppConfig';
import { useSiteId } from './app/useSiteId';
import { useThemeMode } from './app/useThemeMode';

import { useAppNFT } from '@dexkit/ui/hooks/app/useAppNFT';
import { useProtectedAppConfig } from '@dexkit/ui/hooks/app/useProtectedAppConfig';

export { useAppNFT, useProtectedAppConfig };
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

export { useVibecoderDialog } from './app/useVibecoderDialog';

export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}
