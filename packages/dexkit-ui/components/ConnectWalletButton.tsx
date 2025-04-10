import {
  appMetadata,
  client,
  wallets,
} from "@dexkit/wallet-connectors/thirdweb/client";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FormattedMessage } from "react-intl";
import { AutoConnect, useIsAutoConnecting } from "thirdweb/react";
import { useWalletConnect } from "../hooks/wallet";
import WalletIcon from "./icons/Wallet";

export function ConnectWalletButton() {
  const isAutoConnecting = useIsAutoConnecting();

  const { connectWallet, isConnecting } = useWalletConnect();

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
        onClick={connectWallet}
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
        {isConnecting || isAutoConnecting ? (
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
