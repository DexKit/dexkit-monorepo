import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  lighten,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";

import { useWeb3React } from "@web3-react/core";

import AppDialogTitle from "../AppDialogTitle";

import { MagicLoginType } from "@dexkit/core/constants";
import { useSnackbar } from "notistack";
import { useWalletActivate } from "../../hooks";

interface Props {
  DialogProps: DialogProps;
}

export default function ConnectWalletDialog({
  DialogProps: dialogProps,
}: Props) {
  const { onClose } = dialogProps;

  const { connector } = useWeb3React();
  const walletActivate = useWalletActivate();

  const { formatMessage } = useIntl();

  const [connectorName, setConnectorName] = useState<string>();
  const [loginType, setLoginType] = useState<MagicLoginType>();

  const handelClose = () => {
    onClose!({}, "backdropClick");
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleActivateWallet = async (
    connectorName: string,
    loginType?: MagicLoginType,
    email?: string,
  ) => {
    setConnectorName(connectorName);
    setLoginType(loginType);

    try {
      await walletActivate.mutateAsync({ connectorName, loginType, email });
    } catch (err: any) {
      enqueueSnackbar(err.message, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
    handelClose();
    setConnectorName(undefined);
  };

  const [email, setEmail] = useState("");

  const handleConnectWithEmail = () => {
    handleActivateWallet("magic", "email", email);
    setEmail("");
  };

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail((e.target as any).value);
  };

  const renderConnectors = () => {
    const walletConnectors: {
      id: string;
      name: string;
      icon: string;
      loginType?: MagicLoginType;
    }[] = [
      { id: "metamask", name: "MetaMask", icon: "" },
      { id: "magic", name: "Google", icon: "", loginType: "google" },
      { id: "magic", name: "Twitter", icon: "", loginType: "twitter" },
    ];

    return walletConnectors.map((conn, index: number) => (
      <ListItemButton
        divider
        key={index}
        disabled={
          walletActivate.isLoading &&
          connectorName === conn.id &&
          conn.loginType === loginType
        }
        onClick={() => handleActivateWallet(conn.id, conn.loginType)}
      >
        <ListItemAvatar>
          <Avatar src={conn.icon}>
            {walletActivate.isLoading &&
            connectorName === conn.id &&
            conn.loginType === loginType ? (
              <CircularProgress
                color="primary"
                sx={{ fontSize: (theme) => theme.spacing(4) }}
              />
            ) : (
              <Avatar
                sx={(theme) => ({
                  background: lighten(theme.palette.background.default, 0.05),
                  padding: theme.spacing(1),
                  width: "auto",
                  height: theme.spacing(5),
                })}
                src={conn.icon}
                alt={conn.name}
              />
            )}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={conn.name} />
      </ListItemButton>
    ));
  };

  return (
    <Dialog {...dialogProps} onClose={handelClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="connect.your.wallet"
            defaultMessage="Connect Your Wallet"
          />
        }
        onClose={handelClose}
      />
      <Divider />
      <DialogContent sx={{ padding: 0 }}>
        <Box p={2}>
          <Stack spacing={2}>
            <TextField
              disabled={
                walletActivate.isLoading &&
                connectorName === "magic" &&
                loginType === "email"
              }
              value={email}
              onChange={handleChangeEmail}
              type="email"
              placeholder={formatMessage({
                id: "email",
                defaultMessage: "Email",
              })}
            />
            <Button
              disabled={
                walletActivate.isLoading &&
                connectorName === "magic" &&
                loginType === "email"
              }
              startIcon={
                walletActivate.isLoading &&
                connectorName === "magic" &&
                loginType === "email"
              }
              onClick={handleConnectWithEmail}
              variant="contained"
            >
              <FormattedMessage
                id="connect.with.email"
                defaultMessage="Connect with e-mail"
              />
            </Button>
          </Stack>
        </Box>
        <Divider />
        <List disablePadding>{renderConnectors()}</List>
      </DialogContent>
    </Dialog>
  );
}
