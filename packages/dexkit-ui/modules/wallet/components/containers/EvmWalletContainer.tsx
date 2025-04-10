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

import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "../../../../components/AppLink";

import { copyToClipboard, truncateAddress } from "@dexkit/core/utils";
import CopyIconButton from "@dexkit/ui/components/CopyIconButton";
import FileCopy from "@mui/icons-material/FileCopy";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import dynamic from "next/dynamic";

import { NetworkSelectButton } from "../../../../components/NetworkSelectButton";
const TransakWidget = dynamic(() => import("@dexkit/ui/components/Transak"));

import { DexkitApiProvider } from "@dexkit/core/providers";
import { AppErrorBoundary } from "../../../../components/AppErrorBoundary";
import ImportTokenDialog from "../../../../components/dialogs/ImportTokenDialog";
import CloseCircle from "../../../../components/icons/CloseCircle";
import { myAppsApi } from "../../../../constants/api";
import { useAppConfig, useAuth, useEvmCoins } from "../../../../hooks";
import { isBalancesVisibleAtom } from "../../state";
import {
  TransactionsTable,
  TransactionsTableFilter,
} from "../TransactionsTable";
import { TransferCoinButton } from "../TransferCoinButton";
import UserActivityTable from "../UserActivityTable";
import WalletActionButton from "../WalletActionButton";
import WalletBalances from "../WalletBalancesTable";
import { WalletTotalBalanceCointainer } from "../WalletTotalBalanceContainer";

import { useRouter } from "next/router";

import { useIsMobile } from "@dexkit/core";
import LoginAppButton from "@dexkit/ui/components/LoginAppButton";
import { ConnectButton } from "../../../../components/ConnectButton";
import { useWalletConnect } from "../../../../hooks/wallet";

const EvmReceiveDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/EvmReceiveDialog")
);

const ScanWalletQrCodeDialog = dynamic(
  async () => import("@dexkit/ui/components/dialogs/ScanWalletQrCodeDialog")
);

enum WalletTabs {
  Transactions,
  Trades,
  Activity,
}

const EvmWalletContainer = () => {
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
    // we are not allowing to change chainId when user sets defaultChainId
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
    } catch (err) {}
  };

  const handleOpenQrCode = () => setShowQrCode(true);

  const isMobile = useIsMobile();

  return (
    <>
      {showQrCode && (
        <ScanWalletQrCodeDialog
          DialogProps={{
            open: showQrCode,
            maxWidth: "sm",
            fullWidth: true,
            fullScreen: isMobile,
            onClose: handleOpenQrCodeScannerClose,
          }}
          onResult={handleAddressResult}
        />
      )}

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
      <ImportTokenDialog
        dialogProps={{
          open: isImportDialogOpen,
          onClose: handleCloseImportTokenDialog,
          maxWidth: "xs",
          fullWidth: true,
        }}
      />
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                alignContent="center"
                spacing={2}
              >
                {isActive && (
                  <Grid item xs={12}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignContent="center"
                    >
                      <Box>
                        <Typography color="textSecondary" variant="caption">
                          {isBalancesVisible
                            ? ENSName
                              ? ENSName
                              : truncateAddress(account)
                            : "*****"}
                          <CopyIconButton
                            iconButtonProps={{
                              onClick: handleCopy,
                              size: "small",
                              color: "inherit",
                            }}
                            tooltip={formatMessage({
                              id: "copy",
                              defaultMessage: "Copy",
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
                      <NetworkSelectButton
                        chainId={chainId}
                        onChange={(newChainId) => setChainId(newChainId)}
                      />
                    </Stack>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="center">
                    {appConfig.transak?.enabled && (
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
                      <TransferCoinButton />
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
                        {/*Object.keys(favorites.assets).length > 0 && (
                            <Chip
                              label={Object.keys(favorites.assets).length}
                              color="secondary"
                            />
                          )*/}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        alignContent="center"
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                          color="primary"
                          variant="body1"
                        >
                          <FormattedMessage id="open" defaultMessage="Open" />
                        </Typography>
                        <NavigateNext color="primary" />
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
                          <FormattedMessage
                            id="orders"
                            defaultMessage="Orders"
                          />
                        </Typography>
                        {/* <Chip label="302" color="secondary" /> */}
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        alignContent="center"
                      >
                        <Typography
                          sx={{
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                          color="primary"
                          variant="body1"
                        >
                          <FormattedMessage id="open" defaultMessage="Open" />
                        </Typography>
                        <NavigateNext color="primary" />
                      </Stack>
                    </WalletActionButton>
                  </Grid>
                </Grid>
              </Grid>
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
            </>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EvmWalletContainer;
