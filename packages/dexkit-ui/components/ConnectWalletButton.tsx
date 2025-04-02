
import { appMetadata, client, wallets } from "@dexkit/wallet-connectors/thirdweb/client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FormattedMessage } from "react-intl";
import { AutoConnect, useConnectModal, useIsAutoConnecting } from "thirdweb/react";
import { ThemeMode } from "../constants/enum";
import { useThemeMode } from "../hooks";
import WalletIcon from "./icons/Wallet";

export function ConnectWalletButton() {
  const isAutoConnecting = useIsAutoConnecting();
    const { mode } = useThemeMode();


  const { connect, isConnecting } = useConnectModal();
 
  async function handleConnect() {
    const wallet = await connect({ client, wallets, appMetadata, size: 'compact', showThirdwebBranding: false, theme: mode === ThemeMode.light ? 'light': 'dark'  }); // opens the connect modal
  }

  return (
    <>
    <AutoConnect
      wallets={wallets}
      client={client}
      appMetadata={appMetadata}
    />


    <Button
      variant="outlined"
      color="inherit"
      onClick={() => handleConnect()}
      startIcon={
        isConnecting || isAutoConnecting ? (
          <CircularProgress
            color="inherit"
            sx={{ fontSize: (theme) => theme.spacing(2) }}
          />
        ) : (
          <WalletIcon />
        )
      }
      endIcon={<ChevronRightIcon />}
    >
      {isConnecting || isAutoConnecting  ? (
        <FormattedMessage
          id="loading.wallet"
          defaultMessage="Loading Wallet"
          description="Loading wallet button"
        />
      ) : (
        <FormattedMessage
          id="connect.wallet"
          defaultMessage="Connect Wallet"
          description="Connect wallet button"
        />
      )}
    </Button>
    </>
  );
}
