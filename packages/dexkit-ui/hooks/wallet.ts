import { UserOffChainEvents } from "@dexkit/core/constants/userEvents";
import { useAppConfig, useThemeMode } from "@dexkit/ui/hooks";
import {
  appMetadata,
  client,
  wallets,
} from "@dexkit/wallet-connectors/thirdweb/client";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { darkTheme, lightTheme, useConnectModal } from "thirdweb/react";
import { ThemeMode } from "../constants/enum";
import { useTrackUserEventsMutation } from "./userEvents";

export const useWalletConnect = () => {
  const { connect, isConnecting } = useConnectModal();
  const trackUserEvents = useTrackUserEventsMutation();

  const { mode } = useThemeMode();
  const theme = useTheme();
  const config = useAppConfig();

  const appMetadataConfig = useMemo(() => {
    if (mode === ThemeMode.light) {
      return {
        ...appMetadata,
        logoUrl: config.logo?.url,
        name: config.name,
        url: config.domain,
      };
    } else {
      return {
        ...appMetadata,
        logoUrl: config.logoDark?.url,
        name: config.name,
        url: config.domain,
      };
    }
  }, [config.logo, config.logoDark, config.name, mode]);

  const colors = {
    modalBg: theme.palette.background.default,
    primaryButtonBg: theme.palette.action.active,
  };

  const connectWallet = async () => {
    try {

      const wallet = await connect({
        client,
        wallets,
        appMetadata: appMetadataConfig,
        size: "compact",
        showThirdwebBranding: false,
        theme:
          mode === ThemeMode.light
            ? lightTheme({
                colors,
              })
            : darkTheme({ colors }),
      });

      if (wallet) {
        const account = (wallet.getAccount()?.address as string).toLowerCase();
        trackUserEvents.mutate({
          event: UserOffChainEvents.connectAccount,
          chainId: wallet.getChain()?.id,
          from: account,
          metadata: JSON.stringify({
            account,
            id: wallet?.id,
          }),
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return {
    connectWallet,
    isConnecting,
  };
};
