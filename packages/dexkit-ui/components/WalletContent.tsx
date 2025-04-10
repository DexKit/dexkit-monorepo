import { copyToClipboard, truncateAddress } from "@dexkit/core/utils";
import {
  useConnectWalletDialog,
  useEvmCoins,
  useLogoutAccountMutation,
} from "@dexkit/ui";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import dynamic from "next/dynamic";

import { NETWORK_IMAGE, NETWORK_NAME } from "@dexkit/core/constants/networks";

import { AccountBalance } from "@dexkit/ui/components/AccountBalance";
import TransakWidget from "@dexkit/ui/components/Transak";
import FileCopy from "@mui/icons-material/FileCopy";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Logout from "@mui/icons-material/Logout";
import Send from "@mui/icons-material/Send";
import SwitchAccount from "@mui/icons-material/SwitchAccount";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  WalletIcon,
  WalletProvider, useActiveWallet, useConnectedWallets, useDisconnect
} from "thirdweb/react";
import { useBalanceVisible } from "../modules/wallet/hooks";


const EvmReceiveDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/EvmReceiveDialog")
);

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog"
    )
);

const SelectNetworkDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectNetworkDialog")
);

export default function WalletContent() {
  const { account, ENSName, chainId, connector } = useWeb3React();

  const theme = useTheme()
  const wallet = useActiveWallet();

  const { disconnect } = useDisconnect();
 const wallets = useConnectedWallets();
 
  const logoutMutation = useLogoutAccountMutation();
  const connectWalletDialog = useConnectWalletDialog();
  const handleSwitchWallet = () => {
    connectWalletDialog.setOpen(true);
  };

  const handleLogoutWallet = useCallback(async () => {
    logoutMutation.mutate();
    if (wallet) {
      disconnect(wallet);
    }
  }, [logoutMutation, connector]);

  const [isBalancesVisible, setIsBalancesVisible] = useBalanceVisible();

  const handleToggleVisibility = () => {
    setIsBalancesVisible((value: boolean) => !value);
  };

  const handleCopy = () => {
    if (account) {
      copyToClipboard(account);
    }
  };

  const { formatMessage } = useIntl();

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const evmCoins = useEvmCoins({ defaultChainId: chainId });

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const [isSendOpen, setIsSendOpen] = useState(false);

  const handleOpenSend = () => {
    setIsSendOpen(true);
  };

  const handleCloseSend = () => {
    setIsSendOpen(false);
  };

  const [isOpen, setOpen] = useState(false);

  const handleSwitchNetwork = () => {
    setOpen(true);
  };

  const handleSwitchNetworkClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isOpen && (
        <SelectNetworkDialog
          dialogProps={{
            maxWidth: "sm",
            open: isOpen,
            fullWidth: true,
            onClose: handleSwitchNetworkClose,
          }}
        />
      )}

      {isSendOpen && (
        <EvmTransferCoinDialog
          dialogProps={{
            open: isSendOpen,
            onClose: handleCloseSend,
            fullWidth: true,
            maxWidth: "sm",
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            coins: evmCoins,
          }}
        />
      )}

      {isReceiveOpen && (
        <EvmReceiveDialog
          dialogProps={{
            open: isReceiveOpen,
            onClose: handleCloseReceive,
            maxWidth: "sm",
            fullWidth: true,
          }}
          receiver={account}
          chainId={chainId}
          coins={evmCoins}
        />
      )}

      <Box sx={{ px: 1, py: 2 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            justifyContent={"space-between"}
          >
            <Stack direction="row" spacing={1} alignItems="center">
               {wallets && wallets.length ? (
                          <WalletProvider id={wallets[0].id}>
                            <WalletIcon width={theme.spacing(2)} height={theme.spacing(2)} />
                          </WalletProvider>
                        ):       <Avatar
                        sx={(theme) => ({
                          width: theme.spacing(2),
                          height: theme.spacing(2),
                          background: theme.palette.action.hover,
                        })}
                        variant="rounded"
                      />
                      
                      }


           
              <Box>
                <Typography variant="caption" align="left" component="div">
                  {isBalancesVisible
                    ? ENSName
                      ? ENSName
                      : truncateAddress(account)
                    : "**********"}{" "}
                  <CopyIconButton
                    iconButtonProps={{
                      onClick: handleCopy,
                      size: "small",
                    }}
                    tooltip={formatMessage({
                      id: "copy.address",
                      defaultMessage: "Copy address",
                      description: "Copy text",
                    })}
                    activeTooltip={formatMessage({
                      id: "copied",
                      defaultMessage: "Copied!",
                      description: "Copied text",
                    })}
                  >
                    <FileCopy fontSize="inherit" color="inherit" />
                  </CopyIconButton>
                  <Tooltip
                    title={
                      isBalancesVisible ? (
                        <FormattedMessage id={"hide"} defaultMessage={"Hide"} />
                      ) : (
                        <FormattedMessage id={"show"} defaultMessage={"Show"} />
                      )
                    }
                  >
                    <IconButton onClick={handleToggleVisibility}>
                      {isBalancesVisible ? (
                        <VisibilityIcon fontSize="small" />
                      ) : (
                        <VisibilityOffIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Typography>
                <div>
                  <AccountBalance isBalancesVisible={isBalancesVisible} />
                </div>
              </Box>
            </Stack>
            <Tooltip
              title={
                <FormattedMessage
                  id={"logout.wallet"}
                  defaultMessage={"Logout wallet"}
                />
              }
            >
              <IconButton onClick={handleLogoutWallet}>
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Tooltip
            title={
              <FormattedMessage
                id={"switch.network"}
                defaultMessage={"Switch network"}
              />
            }
          >
            <ButtonBase
              sx={{
                display: "block",
                px: 1,
                py: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: (theme) => theme.spacing(1),
              }}
              onClick={handleSwitchNetwork}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    src={NETWORK_IMAGE(chainId)}
                    alt={`network chainId: ${chainId}`}
                    sx={{ width: "1rem", height: "1rem" }}
                  />
                  <Typography>{NETWORK_NAME(chainId)}</Typography>
                </Stack>
                <KeyboardArrowRightIcon />
              </Stack>
            </ButtonBase>
          </Tooltip>
          <Divider />
          <Stack spacing={2} direction="row">
            <Button
              fullWidth
              startIcon={<Send />}
              color="inherit"
              variant="outlined"
              onClick={handleOpenSend}
            >
              <FormattedMessage id="send" defaultMessage="Send" />
            </Button>
            <Button
              startIcon={<VerticalAlignBottomIcon />}
              color="inherit"
              variant="outlined"
              fullWidth
              onClick={handleOpenReceive}
            >
              <FormattedMessage id="receive" defaultMessage="Receive" />
            </Button>
          </Stack>
          <Stack spacing={2} direction="row">
            <TransakWidget
              buttonProps={{ color: "inherit", variant: "outlined" }}
            ></TransakWidget>

            <Button
              onClick={handleSwitchWallet}
              startIcon={<SwitchAccount fontSize="small" />}
              variant="outlined"
              color="inherit"
            >
              <FormattedMessage
                id="switch.wallet"
                defaultMessage="Switch wallet"
              />
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}