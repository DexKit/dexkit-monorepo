import { Box, Button, Stack, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { DexkitApiProvider } from "@dexkit/core/providers";
import { myAppsApi } from "@dexkit/ui/constants/api";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import React, { useState } from "react";

import ChevronRight from "@mui/icons-material/ChevronRight";
import Wallet from "@mui/icons-material/Wallet";

import useNotificationsCountUnread from "@dexkit/ui/modules/commerce/hooks/useNotificatonsCountUnread";

import { useConnectWalletDialog } from "../../../../hooks";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  page?: string;
}

function RequireLogin({
  page,
  children,
}: {
  page: string;
  children: React.ReactNode;
}) {
  const { isActive } = useWeb3React();

  const connectWalletDialog = useConnectWalletDialog();

  const { data } = useNotificationsCountUnread({ scope: "Store" });

  const [open, setOpen] = useState(
    ["categories", "products", "collections"].includes(page),
  );

  if (isActive) {
    return <Box>{children}</Box>;
  }

  return (
    <Box py={4}>
      <Stack
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        spacing={2}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          alignContent="center"
        >
          <Typography variant="h5">
            <FormattedMessage
              id="no.wallet.connected"
              defaultMessage="No Wallet connected"
            />
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <FormattedMessage
              id="connect.wallet.to.see.apps.associated.with.your.account"
              defaultMessage="Connect wallet to see apps associated with your account"
            />
          </Typography>
        </Stack>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => connectWalletDialog.setOpen(true)}
          startIcon={<Wallet />}
          endIcon={<ChevronRight />}
        >
          <FormattedMessage
            id="connect.wallet"
            defaultMessage="Connect Wallet"
            description="Connect wallet button"
          />
        </Button>
      </Stack>
    </Box>
  );
}

export default function DashboardLayout({
  children,
  page,
}: DashboardLayoutProps) {
  return (
    <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
      <RequireLogin page={page ?? ""}>{children}</RequireLogin>
    </DexkitApiProvider.Provider>
  );
}
