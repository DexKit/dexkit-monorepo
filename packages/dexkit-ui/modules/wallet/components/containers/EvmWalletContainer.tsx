import { NavigateNext, QrCodeScanner, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  NoSsr,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Grid from "@mui/material/Grid";

import React, { useEffect, useState } from "react";

import { FormattedMessage, useIntl } from "react-intl";


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
    } catch (err) { }
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Grid container spacing={3}>
          {/* Header Section */}
          {isActive && (
            <Grid size={12}>
              <Card sx={{ p: 3, mb: 2 }}>
                <Stack spacing={3}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Typography color="text.primary" variant="caption">
                          {isBalancesVisible
                            ? ENSName
                              ? ENSName
                              : truncateAddress(account)
                            : "*****"}
                        </Typography>
                        <CopyIconButton
                          iconButtonProps={{
                            onClick: handleCopy,
                            size: "small",
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
                          <FileCopy fontSize="small" sx={{ color: 'text.primary' }} />
                        </CopyIconButton>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                          <NoSsr>
                            <WalletTotalBalanceCointainer chainId={chainId} />
                          </NoSsr>
                        </Typography>
                        <IconButton
                          onClick={handleToggleVisibility}
                          sx={{
                            color: theme.palette.text.primary,
                          }}
                        >
                          {isBalancesVisible ? (
                            <VisibilityIcon sx={{ color: 'text.primary' }} />
                          ) : (
                            <VisibilityOffIcon sx={{ color: 'text.primary' }} />
                          )}
                        </IconButton>
                      </Stack>
                    </Box>
                    <NetworkSelectButton
                      chainId={chainId}
                      onChange={(newChainId) => setChainId(newChainId)}
                    />
                  </Stack>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      onClick={handleOpenReceive}
                      variant="outlined"
                      startIcon={<VerticalAlignBottomIcon />}
                      disabled={!isActive}
                      color="primary"
                      sx={{ minWidth: 120 }}
                    >
                      <FormattedMessage
                        id="receive"
                        defaultMessage="Receive"
                      />
                    </Button>
                    <TransferCoinButton />
                    <Button
                      onClick={handleOpenQrCode}
                      startIcon={<QrCodeScanner />}
                      variant="outlined"
                      sx={{ minWidth: 120 }}
                    >
                      <FormattedMessage id="scan" defaultMessage="Scan" />
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          )}

          {isActive && (
            <Grid size={12}>
              <Card sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    size="small"
                    type="search"
                    placeholder={formatMessage({
                      id: "search.tokens",
                      defaultMessage: "Search tokens"
                    })}
                    onChange={(ev) => setSearch(ev.currentTarget.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    onClick={handleOpenImportTokenDialog}
                    variant="outlined"
                    disabled={!isActive}
                    startIcon={<ImportExportIcon />}
                    sx={{ minWidth: 140, height: 40 }}
                  >
                    <FormattedMessage
                      id="import.token"
                      defaultMessage="Import token"
                    />
                  </Button>
                </Stack>
              </Card>
            </Grid>
          )}

          {!isActive && (
            <Grid size={12}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Stack spacing={3} alignItems="center">
                  <CloseCircle color="error" sx={{ fontSize: 48 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      <FormattedMessage
                        id="wallet.is.not.connected"
                        defaultMessage="Wallet is not connected"
                      />
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      <FormattedMessage
                        id="please.connect.your.wallet.to.see.balance"
                        defaultMessage="Please, connect your wallet to see your balance"
                      />
                    </Typography>
                  </Box>
                  <ConnectButton variant="contained" color="primary" size="large" />
                </Stack>
              </Card>
            </Grid>
          )}

          {isActive && (
            <Grid size={12}>
              <Card sx={{ p: 2, mb: 2 }}>
                <NoSsr>
                  <WalletBalances chainId={chainId} filter={search} />
                </NoSsr>
              </Card>
            </Grid>
          )}

          {isActive && (
            <Grid size={12}>
              <Card sx={{ p: 2, mb: 2 }}>
                <WalletActionButton
                  disabled={!isActive}
                  LinkComponent={Link}
                  href="/wallet/nfts"
                  sx={{ width: '100%', p: 3 }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        <FormattedMessage id="nfts" defaultMessage="NFTs" />
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
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
                  </Stack>
                </WalletActionButton>
              </Card>
            </Grid>
          )}

          {isActive && (
            <Grid size={12}>
              <Card sx={{ overflow: 'hidden' }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleChangeTab}
                  variant="fullWidth"
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500,
                      minHeight: 48,
                      fontSize: '0.95rem',
                    }
                  }}
                >
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

                <Box sx={{ p: 2 }}>
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
                            <Stack justifyContent="center" alignItems="center" sx={{ py: 4 }}>
                              <LoginAppButton />
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
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default EvmWalletContainer;
