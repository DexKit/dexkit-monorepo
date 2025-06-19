import { NavigateNext, QrCodeScanner, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  NoSsr,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormattedMessage, useIntl } from "react-intl";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAtom } from "jotai";

import Link from "@dexkit/ui/components/AppLink";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { copyToClipboard, truncateAddress } from "@dexkit/core/utils";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import FileCopy from "@mui/icons-material/FileCopy";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import dynamic from "next/dynamic";

const TransakWidget = dynamic(() => import("@dexkit/ui/components/Transak"));

import { DexkitApiProvider } from "@dexkit/core/providers";
import { AppErrorBoundary } from "@dexkit/ui/components/AppErrorBoundary";
import CloseCircle from "@dexkit/ui/components/icons/CloseCircle";
import { myAppsApi } from "@dexkit/ui/constants/api";
import { useAppConfig, useAuth, useEvmCoins } from "@dexkit/ui/hooks";
import {
  TransactionsTable,
  TransactionsTableFilter,
} from "@dexkit/ui/modules/wallet/components/TransactionsTable";
import UserActivityTable from "@dexkit/ui/modules/wallet/components/UserActivityTable";
import WalletActionButton from "@dexkit/ui/modules/wallet/components/WalletActionButton";
import WalletBalances from "@dexkit/ui/modules/wallet/components/WalletBalancesTable";
import { WalletTotalBalanceCointainer } from "@dexkit/ui/modules/wallet/components/WalletTotalBalanceContainer";
import { isBalancesVisibleAtom } from "@dexkit/ui/modules/wallet/state";

import { useRouter } from "next/router";

import { useIsMobile } from "@dexkit/core";
import { ConnectButton } from "@dexkit/ui/components/ConnectButton";
import LoginAppButton from "@dexkit/ui/components/LoginAppButton";
import { useWalletConnect } from "@dexkit/ui/hooks/wallet";

import GlassEvmReceiveDialog from "./GlassEvmReceiveDialog";
import GlassEvmSendDialog from "./GlassEvmSendDialog";
import GlassImportTokenDialog from "./GlassImportTokenDialog";
import { GlassNetworkSelectButton } from "./GlassNetworkSelectButton";
import GlassScanWalletQrCodeDialog from "./GlassScanWalletQrCodeDialog";

import Send from "@mui/icons-material/Send";

enum WalletTabs {
  Transactions,
  Trades,
  Activity,
}

interface Props {
  blurIntensity?: number;
  glassOpacity?: number;
  textColor?: string;
}

const GlassEvmWalletContainer = ({
  blurIntensity = 40,
  glassOpacity = 0.10,
  textColor = '#ffffff'
}: Props) => {
  const appConfig = useAppConfig();

  const { account, isActive, chainId: walletChainId, ENSName } = useWeb3React();
  const [chainId, setChainId] = useState(walletChainId);

  const { formatMessage } = useIntl();
  const evmCoins = useEvmCoins({ defaultChainId: chainId });

  const theme = useTheme();
  const { connectWallet } = useWalletConnect();
  const handleConnectWallet = () => {
    connectWallet();
  };
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);

  const { isLoggedIn } = useAuth();

  const [selectedTab, setSelectedTab] = useState(WalletTabs.Activity);
  const [isTableOpen, setIsTableOpen] = useState(isDesktop);
  const [search, setSearch] = useState("");

  const [isBalancesVisible, setIsBalancesVisible] = useAtom(
    isBalancesVisibleAtom
  );

  const handleChangeTab = (
    event: React.SyntheticEvent<Element, Event>,
    value: WalletTabs
  ) => {
    setSelectedTab(value);
  };

  const handleToggleBalances = () => {
    setIsTableOpen((value) => !value);
  };

  const handleToggleVisibility = () => {
    setIsBalancesVisible((value) => !value);
  };

  const handleOpenReceive = () => {
    setIsReceiveOpen(true);
  };

  const handleCloseReceive = () => {
    setIsReceiveOpen(false);
  };

  const handleOpenSend = () => {
    setIsSendOpen(true);
  };

  const handleCloseSend = () => {
    setIsSendOpen(false);
  };

  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleCloseImportTokenDialog = () => {
    setIsImportDialogOpen(false);
  };

  const handleOpenImportTokenDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleCopy = () => {
    if (account) {
      if (ENSName) {
        copyToClipboard(ENSName);
      } else {
        copyToClipboard(account);
      }
    }
  };

  useEffect(() => {
    if (walletChainId) {
      setChainId(walletChainId);
    }
  }, [walletChainId]);

  const [showQrCode, setShowQrCode] = useState(false);

  const handleOpenQrCodeScannerClose = () => {
    setShowQrCode(false);
  };

  const router = useRouter();

  const handleAddressResult = (result: string) => {
    try {
      if (isMobile) {
        router.push(`/wallet/send/${encodeURIComponent(result)}`);
      } else {
        window.open(`/wallet/send/${encodeURIComponent(result)}`, "_blank");
      }
      handleOpenQrCodeScannerClose();
    } catch (err) { }
  };

  const handleOpenQrCode = () => setShowQrCode(true);

  const isMobile = useIsMobile();

  return (
    <>
      {showQrCode && (
        <GlassScanWalletQrCodeDialog
          DialogProps={{
            open: showQrCode,
            maxWidth: "sm",
            fullWidth: true,
            fullScreen: isMobile,
            onClose: handleOpenQrCodeScannerClose,
          }}
          onResult={handleAddressResult}
          blurIntensity={blurIntensity}
          glassOpacity={glassOpacity}
          textColor={textColor}
        />
      )}

      <GlassEvmReceiveDialog
        dialogProps={{
          open: isReceiveOpen,
          onClose: handleCloseReceive,
          maxWidth: "sm",
          fullWidth: true,
          fullScreen: isMobile,
        }}
        receiver={account}
        chainId={chainId}
        coins={evmCoins}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={textColor}
      />

      <GlassEvmSendDialog
        dialogProps={{
          open: isSendOpen,
          onClose: handleCloseSend,
          maxWidth: "sm",
          fullWidth: true,
          fullScreen: isMobile,
        }}
        params={{
          account,
          ENSName,
          chainId,
          coins: evmCoins,
          onConnectWallet: handleConnectWallet,
        }}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={textColor}
      />

      <GlassImportTokenDialog
        dialogProps={{
          open: isImportDialogOpen,
          onClose: handleCloseImportTokenDialog,
          maxWidth: "xs",
          fullWidth: true,
          fullScreen: isMobile,
        }}
        blurIntensity={blurIntensity}
        glassOpacity={glassOpacity}
        textColor={textColor}
      />

      <Grid container spacing={2}>
        {isActive && account && (
          <Grid item xs={12}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    gap: 1,
                  }}
                >
                  {ENSName ? ENSName : truncateAddress(account)}
                  <CopyIconButton
                    iconButtonProps={{
                      onClick: handleCopy,
                      sx: { fontSize: "inherit" }
                    }}
                    tooltip={ENSName ? ENSName : account}
                  >
                    <FileCopy fontSize="inherit" color="inherit" />
                  </CopyIconButton>
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  spacing={1}
                >
                  <Typography variant="h5">
                    <NoSsr>
                      <WalletTotalBalanceCointainer chainId={chainId} />
                    </NoSsr>
                  </Typography>
                  <IconButton onClick={handleToggleVisibility}>
                    {isBalancesVisible ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </Stack>
              </Box>
              <GlassNetworkSelectButton
                chainId={chainId}
                onChange={(newChainId: number) => setChainId(newChainId)}
                blurIntensity={blurIntensity}
                glassOpacity={glassOpacity}
                textColor={textColor}
              />
            </Stack>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            {/* TODO: As a workaround for https://github.com/DexKit/dexkit-monorepo/issues/462#event-17351363710 buy button is hidden */}
            {/* {appConfig.transak?.enabled && ( */}
            {false && (
              <Grid item>
                <TransakWidget />
              </Grid>
            )}

            <Grid item>
              <Button
                onClick={handleOpenReceive}
                variant="outlined"
                startIcon={<VerticalAlignBottomIcon />}
                disabled={!isActive}
                color="primary"
              >
                <FormattedMessage
                  id="receive"
                  defaultMessage="Receive"
                />
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleOpenSend}
                startIcon={<Send />}
                variant="outlined"
                color="primary"
                disabled={!isActive}
              >
                <FormattedMessage id="send" defaultMessage="Send" />
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleOpenQrCode}
                startIcon={<QrCodeScanner />}
                variant="outlined"
              >
                <FormattedMessage id="scan" defaultMessage="Scan" />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid
              item
              xs={isDesktop ? undefined : 12}
              sm={isDesktop ? true : undefined}
            >
              <TextField
                size="small"
                type="search"
                onChange={(ev) => setSearch(ev.currentTarget.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={isDesktop ? undefined : 12}>
              <Button
                onClick={handleOpenImportTokenDialog}
                variant="outlined"
                disabled={!isActive}
                startIcon={<ImportExportIcon />}
                fullWidth
              >
                <FormattedMessage
                  id="import.token"
                  defaultMessage="Import token"
                />
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {!isActive && (
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              spacing={2}
            >
              <CloseCircle color="error" />
              <Box>
                <Typography
                  align="center"
                  variant="subtitle1"
                  sx={{ fontWeight: 600 }}
                >
                  <FormattedMessage
                    id="wallet.is.not.connected"
                    defaultMessage="Wallet is not connected"
                  />
                </Typography>
                <Typography
                  align="center"
                  variant="body2"
                  color="textSecondary"
                >
                  <FormattedMessage
                    id="please.connect.your.wallet.to.see.balance"
                    defaultMessage="Please, connect your wallet to see your balance"
                  />
                </Typography>
              </Box>
              <ConnectButton variant="contained" />
            </Stack>
          )}
        </Grid>

        {isActive && (
          <Grid item xs={12}>
            <NoSsr>
              <Collapse in={isTableOpen}>
                <WalletBalances chainId={chainId} filter={search} />
              </Collapse>
            </NoSsr>
          </Grid>
        )}

        {isActive && (
          <Grid item xs={12}>
            <Button
              onClick={handleToggleBalances}
              fullWidth
              sx={(theme) => ({
                backgroundColor: theme.palette.background.paper,
                py: 2,
              })}
              startIcon={
                isTableOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />
              }
            >
              {isTableOpen ? (
                <FormattedMessage id="close" defaultMessage="Close" />
              ) : (
                <FormattedMessage id="open" defaultMessage="Open" />
              )}
            </Button>
          </Grid>
        )}

        <>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <WalletActionButton
                  disabled={!isActive}
                  LinkComponent={Link}
                  href="/wallet/nfts"
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    alignContent="center"
                  >
                    <Typography variant="h5">
                      <FormattedMessage id="nfts" defaultMessage="NFTs" />
                    </Typography>
                    <NavigateNext />
                  </Stack>
                </WalletActionButton>
              </Grid>
              <Grid item xs={12} sm={6}>
                <WalletActionButton
                  disabled={!isActive}
                  LinkComponent={Link}
                  href="/wallet/orders"
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    alignContent="center"
                  >
                    <Typography variant="h5">
                      <FormattedMessage id="orders" defaultMessage="Orders" />
                    </Typography>
                    <NavigateNext />
                  </Stack>
                </WalletActionButton>
              </Grid>
            </Grid>
          </Grid>
        </>

        {isActive && (
          <Grid item xs={12}>
            <Tabs value={selectedTab} onChange={handleChangeTab}>
              <Tab
                value={WalletTabs.Activity}
                label={
                  <FormattedMessage
                    id="activity"
                    defaultMessage="Activity"
                  />
                }
              />
              <Tab
                value={WalletTabs.Transactions}
                label={
                  <FormattedMessage
                    id="transactions"
                    defaultMessage="Transactions"
                  />
                }
              />
              <Tab
                value={WalletTabs.Trades}
                label={
                  <FormattedMessage id="trades" defaultMessage="Trades" />
                }
              />
            </Tabs>
          </Grid>
        )}
        {isActive && (
          <Grid item xs={12}>
            <NoSsr>
              {selectedTab === WalletTabs.Activity ? (
                <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
                  <AppErrorBoundary
                    fallbackRender={({ error }) => (
                      <Card>
                        <CardContent>
                          <Stack
                            alignItems="center"
                            direction="row"
                            justifyContent="center"
                          >
                            <Stack spacing={1} alignItems="center">
                              <Typography align="center">
                                <FormattedMessage
                                  id="error.while.loading.activity"
                                  defaultMessage="Error while Loading activity"
                                />
                              </Typography>
                              <Button variant="outlined">
                                <FormattedMessage
                                  id="try.again"
                                  defaultMessage="try again"
                                />
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                  >
                    {isLoggedIn ? (
                      <UserActivityTable />
                    ) : (
                      <Stack justifyContent="center">
                        <Box>
                          <LoginAppButton />
                        </Box>
                      </Stack>
                    )}
                  </AppErrorBoundary>
                </DexkitApiProvider.Provider>
              ) : (
                <TransactionsTable
                  filter={
                    selectedTab === WalletTabs.Transactions
                      ? TransactionsTableFilter.Transactions
                      : TransactionsTableFilter.Trades
                  }
                />
              )}
            </NoSsr>
          </Grid>
        )}

        {isLoggedIn && isActive && (
          <Grid item xs={12}>
            <LoginAppButton />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default GlassEvmWalletContainer; 