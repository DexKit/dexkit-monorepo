import { useThemeMode } from "@dexkit/ui/hooks";
import {
  appMetadata,
  client,
  wallets,
} from "@dexkit/wallet-connectors/thirdweb/client";
import { useTheme } from "@mui/material";
import { darkTheme, lightTheme, useConnectModal } from "thirdweb/react";
import { ThemeMode } from "../constants/enum";

export const useWalletConnect = () => {
  const { connect, isConnecting } = useConnectModal();
  const { mode } = useThemeMode();
  const theme = useTheme();

  const colors = {
    modalBg: theme.palette.background.default,
    primaryButtonBg: theme.palette.action.active,
  };

  const connectWallet = async () => {
    const wallet = await connect({
      client,
      wallets,
      appMetadata,
      size: "compact",
      showThirdwebBranding: false,
      theme:
        mode === ThemeMode.light
          ? lightTheme({
              colors,
            })
          : darkTheme({ colors }),
    });

    console.log("connected to : ", wallet);
  };

  return {
    connectWallet,
    isConnecting,
  };
};
