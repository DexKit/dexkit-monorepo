import {
  appMetadata,
  client,
  wallets,
} from "@dexkit/wallet-connectors/thirdweb/client";

import { UserOffChainEvents } from "@dexkit/core/constants/userEvents";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FormattedMessage } from "react-intl";
import { AutoConnect, useIsAutoConnecting } from "thirdweb/react";
import { useTrackUserEventsMutation } from "../hooks/userEvents";
import { useWalletConnect } from "../hooks/wallet";
import WalletIcon from "./icons/Wallet";

export function ConnectWalletButton() {
  const trackUserEvents = useTrackUserEventsMutation();
  const isAutoConnecting = useIsAutoConnecting();
  const { connectWallet, isConnecting } = useWalletConnect();

  return (
    <>
      <AutoConnect
        wallets={wallets}
        client={client}
        appMetadata={appMetadata}
        onConnect={(wallet) => {
          const account = (
            wallet.getAccount()?.address as string
          ).toLowerCase();
          trackUserEvents.mutate({
            event: UserOffChainEvents.connectAccount,
            chainId: wallet.getChain()?.id,
            from: account,
            metadata: JSON.stringify({
              account: account,
              id: wallet?.id,
            }),
          });
        }}
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
