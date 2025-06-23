import { QrCodeScanner, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormattedMessage, useIntl } from "react-intl";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAtom } from "jotai";

import Send from "@mui/icons-material/Send";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { copyToClipboard } from "@dexkit/core/utils";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import dynamic from "next/dynamic";

import { NetworkSelectButton } from "@dexkit/ui/components/NetworkSelectButton";

import ImportTokenDialog from "@dexkit/ui/components/dialogs/ImportTokenDialog";
import { useAppConfig, useAuth, useEvmCoins } from "@dexkit/ui/hooks";
import { useCurrency } from "@dexkit/ui/hooks/currency";
import { useSimpleCoinPricesQuery } from "@dexkit/ui/hooks/currency/useSimpleCoinPricesCurrency";
import UserActivityTable from "@dexkit/ui/modules/wallet/components/UserActivityTable";
import WalletTableRow from "@dexkit/ui/modules/wallet/components/WalletTableRow";
import { WalletTotalBalanceCointainer } from "@dexkit/ui/modules/wallet/components/WalletTotalBalanceContainer";
import { useERC20BalancesQuery, useIsBalanceVisible } from "@dexkit/ui/modules/wallet/hooks";
import { isBalancesVisibleAtom } from "@dexkit/ui/modules/wallet/state";

import { useRouter } from "next/router";

import { useIsMobile } from "@dexkit/core";
import { convertTokenToEvmCoin } from "@dexkit/core/utils";
import { useTokenList } from "@dexkit/ui/hooks/blockchain";
import { useWalletConnect } from "@dexkit/ui/hooks/wallet";
import { WalletCustomSettings } from "@dexkit/ui/modules/wizard/types/section";

const EvmReceiveDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/EvmReceiveDialog")
);

const ScanWalletQrCodeDialog = dynamic(
  async () => import("@dexkit/ui/components/dialogs/ScanWalletQrCodeDialog")
);

const EvmTransferCoinDialog = dynamic(
  () =>
    import(
      "@dexkit/ui/modules/evm-transfer-coin/components/dialogs/EvmSendDialog"
    )
);

interface Props {
  customSettings?: WalletCustomSettings;
}

const CustomTransferCoinButton = ({ customSettings, buttonConfig, fullWidth }: { customSettings?: WalletCustomSettings, buttonConfig?: any, fullWidth?: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { account, chainId, provider, ENSName } = useWeb3React();
  const tokens = useTokenList({ chainId, includeNative: true });
  const theme = useTheme();

  const buttonStyles = {
    backgroundColor: buttonConfig?.backgroundColor || theme.palette.primary.main,
    color: buttonConfig?.textColor || theme.palette.primary.contrastText,
    borderColor: buttonConfig?.borderColor || theme.palette.primary.main,
    '&:hover': {
      backgroundColor: buttonConfig?.hoverBackgroundColor || theme.palette.primary.dark,
    },
  };

  return (
    <>
      {open && (
        <EvmTransferCoinDialog
          dialogProps={{
            open,
            onClose: () => {
              setOpen(false);
            },
            fullWidth: true,
            maxWidth: "sm",
          }}
          params={{
            ENSName,
            account: account,
            chainId: chainId,
            coins: tokens.map(convertTokenToEvmCoin),
          }}
        />
      )}

      <Button
        onClick={() => setOpen(true)}
        startIcon={<Send />}
        variant="outlined"
        disabled={!account}
        fullWidth={fullWidth}
        sx={buttonStyles}
      >
        <FormattedMessage id="send" defaultMessage="send" />
      </Button>
    </>
  );
};

const CustomWalletTotalBalance = ({ customSettings, chainId }: { customSettings?: WalletCustomSettings, chainId?: any }) => {
  const theme = useTheme();

  return (
    <Typography
      variant="h4"
      sx={{
        color: customSettings?.balanceTextColor || theme.palette.text.primary,
        fontSize: { xs: theme.typography.h5.fontSize, sm: theme.typography.h4.fontSize, md: theme.typography.h3.fontSize },
        fontWeight: theme.typography.fontWeightBold,
      }}
    >
      <WalletTotalBalanceCointainer chainId={chainId} />
    </Typography>
  );
};

const CustomNetworkSelectButton = ({ customSettings, chainId, onChange }: {
  customSettings?: WalletCustomSettings,
  chainId?: any,
  onChange: (chainId: number) => void
}) => {
  const theme = useTheme();

  const networkStyles = {
    '& .MuiButton-root': {
      backgroundColor: `${customSettings?.networkSelectorConfig?.backgroundColor || theme.palette.background.paper} !important`,
      color: `${customSettings?.networkSelectorConfig?.textColor || theme.palette.text.primary} !important`,
      border: `1px solid ${customSettings?.networkSelectorConfig?.borderColor || theme.palette.divider} !important`,
      '&:hover': {
        backgroundColor: `${customSettings?.networkSelectorConfig?.hoverBackgroundColor || theme.palette.action.hover} !important`,
        borderColor: `${customSettings?.networkSelectorConfig?.borderColor || theme.palette.divider} !important`,
      },
      '&:focus': {
        borderColor: `${customSettings?.networkSelectorConfig?.borderColor || theme.palette.divider} !important`,
      },
      '& .MuiTypography-root': {
        color: `${customSettings?.networkSelectorConfig?.textColor || theme.palette.text.primary} !important`,
      },
      '& .MuiSvgIcon-root': {
        color: `${customSettings?.networkSelectorConfig?.textColor || theme.palette.text.primary} !important`,
      },
    },
  };

  return (
    <Box sx={networkStyles}>
      <NetworkSelectButton
        chainId={chainId}
        onChange={onChange}
      />
    </Box>
  );
};

const CustomWalletBalances = ({ customSettings, filter }: { customSettings?: WalletCustomSettings, filter?: string }) => {
  const theme = useTheme();
  const isBalancesVisible = useIsBalanceVisible();
  const tokenBalancesQuery = useERC20BalancesQuery(undefined, undefined, false);
  const coinPricesQuery = useSimpleCoinPricesQuery({
    includeNative: true,
    chainId: undefined,
  });
  const prices = coinPricesQuery.data;
  const currency = useCurrency();

  const tokenBalancesWithPrices = useMemo(() => {
    return tokenBalancesQuery?.data?.map((tb: any) => {
      return {
        ...tb,
        price:
          prices && prices[tb.token.address.toLowerCase()]
            ? prices[tb.token.address.toLowerCase()][currency.currency]
            : undefined,
      };
    });
  }, [prices, tokenBalancesQuery.data, currency]);

  const tokenBalancesWithPricesFiltered = useMemo(() => {
    if (filter) {
      const lowercasedFilter = filter.toLowerCase();
      return tokenBalancesWithPrices?.filter(
        (t: any) =>
          t?.token?.name?.toLowerCase().search(lowercasedFilter) !== -1 ||
          t?.token?.symbol?.toLowerCase().search(lowercasedFilter) !== -1 ||
          t?.token?.address?.toLowerCase().search(lowercasedFilter) !== -1
      );
    }
    return tokenBalancesWithPrices;
  }, [tokenBalancesWithPrices, filter]);

  const tableStyles = {
    backgroundColor: customSettings?.cardConfig?.backgroundColor || customSettings?.tokenTableConfig?.headerBackgroundColor || theme.palette.background.paper,
    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
    p: theme.spacing(2),
    border: customSettings?.cardConfig?.borderColor ? `1px solid ${customSettings.cardConfig.borderColor}` : 'none',
    boxShadow: customSettings?.cardConfig?.shadowColor && customSettings?.cardConfig?.shadowIntensity
      ? `0 ${theme.spacing(0.5)} ${theme.spacing(1)} ${customSettings.cardConfig.shadowColor}${Math.round(customSettings.cardConfig.shadowIntensity * 255).toString(16).padStart(2, '0')}`
      : theme.shadows[1],
  };

  const headerCellStyles = {
    color: customSettings?.tokenTableConfig?.headerTextColor || theme.palette.text.primary,
    fontWeight: 'bold',
    backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
  };

  const headerRowStyles = {
    backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
    '& .MuiTableCell-root': {
      backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
      color: `${customSettings?.tokenTableConfig?.headerTextColor || theme.palette.text.primary} !important`,
      fontWeight: 'bold',
      borderBottom: `2px solid ${customSettings?.tokenTableConfig?.borderColor || theme.palette.divider}`,
    },
  };

  return (
    <Box sx={tableStyles}>
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              backgroundColor: customSettings?.tokenTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
            }}
          >
            <TableRow sx={headerRowStyles}>
              <TableCell sx={headerCellStyles}>
                <FormattedMessage id="token" defaultMessage="Token" />
              </TableCell>
              <TableCell sx={headerCellStyles}>
                <FormattedMessage id="total" defaultMessage="Total" />
              </TableCell>
              <TableCell sx={headerCellStyles}>
                <FormattedMessage id="balance" defaultMessage="Balance" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& .MuiTableRow-root': {
                backgroundColor: customSettings?.tokenTableConfig?.rowBackgroundColor || theme.palette.background.default,
                '&:hover': {
                  backgroundColor: customSettings?.tokenTableConfig?.hoverRowBackgroundColor || theme.palette.action.hover,
                },
                '& .MuiTableCell-root': {
                  borderColor: customSettings?.tokenTableConfig?.borderColor || theme.palette.divider,
                  '&:first-of-type': {
                    '& .MuiTypography-body1': {
                      color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
                    },
                    '& .MuiTypography-body2': {
                      color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                    },
                  },
                  '&:nth-of-type(2)': {
                    color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                    '& *': {
                      color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                    },
                  },
                  '&:nth-of-type(3)': {
                    color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                    '& *': {
                      color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary} !important`,
                    },
                  },
                  '& .MuiTypography-root': {
                    color: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
                  },
                  '& .MuiSkeleton-root': {
                    backgroundColor: `${customSettings?.tokenTableConfig?.rowTextColor || theme.palette.text.secondary}33`,
                  },
                },
              },
            }}
          >
            {tokenBalancesWithPricesFiltered?.map((token: any, index: number) => (
              <WalletTableRow
                key={index}
                isLoadingCurrency={coinPricesQuery.isLoading}
                tokenBalance={token}
                price={token.price}
                isBalancesVisible={isBalancesVisible}
                currency={currency.currency}
              />
            ))}
            {tokenBalancesQuery.isLoading &&
              new Array(4).fill(null).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton sx={{ backgroundColor: `${theme.palette.text.secondary}33` }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton sx={{ backgroundColor: `${theme.palette.text.secondary}33` }} />
                  </TableCell>
                  <TableCell>
                    <Skeleton sx={{ backgroundColor: `${theme.palette.text.secondary}33` }} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const CustomUserActivityTable = ({ customSettings }: { customSettings?: WalletCustomSettings }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const activityStyles = {
    backgroundColor: customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper,
    borderRadius: customSettings?.cardConfig?.borderRadius ? theme.spacing(customSettings.cardConfig.borderRadius / 8) : theme.shape.borderRadius,
    p: theme.spacing(2),
    border: `1px solid ${customSettings?.activityTableConfig?.borderColor || 'transparent'}`,
    boxShadow: customSettings?.cardConfig?.shadowColor && customSettings?.cardConfig?.shadowIntensity
      ? `0 ${theme.spacing(0.5)} ${theme.spacing(1)} ${customSettings.cardConfig.shadowColor}${Math.round(customSettings.cardConfig.shadowIntensity * 255).toString(16).padStart(2, '0')}`
      : theme.shadows[1],
    '& .MuiTableHead-root .MuiTableCell-root': {
      color: `${customSettings?.activityTableConfig?.headerTextColor || theme.palette.text.primary} !important`,
      fontWeight: 'bold',
      backgroundColor: `${customSettings?.activityTableConfig?.headerBackgroundColor || customSettings?.cardConfig?.backgroundColor || theme.palette.background.paper} !important`,
      borderBottom: `2px solid ${customSettings?.activityTableConfig?.borderColor || theme.palette.divider}`,
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root': {
        backgroundColor: `${customSettings?.activityTableConfig?.rowBackgroundColor || theme.palette.background.default} !important`,
        '&:hover': {
          backgroundColor: `${customSettings?.activityTableConfig?.hoverRowBackgroundColor || theme.palette.action.hover} !important`,
        },
        '& .MuiTableCell-root': {
          color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          borderColor: `${customSettings?.activityTableConfig?.borderColor || theme.palette.divider} !important`,
          '& .MuiTypography-root': {
            color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          },
          '& .MuiLink-root': {
            color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          },
          '& *': {
            color: `${customSettings?.activityTableConfig?.rowTextColor || theme.palette.text.primary} !important`,
          },
        },
      },
    },
    '& .MuiTableFooter-root': {
      backgroundColor: customSettings?.paginationConfig?.backgroundColor || theme.palette.background.paper,
    },
    '& .MuiTablePagination-root': {
      backgroundColor: customSettings?.paginationConfig?.backgroundColor || theme.palette.background.paper,
      color: `${customSettings?.paginationConfig?.textColor || theme.palette.text.primary} !important`,
      borderTop: `1px solid ${customSettings?.activityTableConfig?.borderColor || theme.palette.divider}`,
      '& .MuiTablePagination-toolbar': {
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        minHeight: isMobile ? 'auto' : 52,
        paddingLeft: isMobile ? theme.spacing(1) : theme.spacing(2),
        paddingRight: isMobile ? theme.spacing(1) : theme.spacing(2),
      },
      '& .MuiTablePagination-spacer': {
        display: isMobile ? 'none' : 'flex',
      },
      '& .MuiTablePagination-selectLabel': {
        color: `${customSettings?.paginationConfig?.textColor || theme.palette.text.primary} !important`,
        fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
        margin: isMobile ? theme.spacing(0.5, 0.5, 0.5, 0) : 'inherit',
        order: isMobile ? 1 : 'inherit',
      },
      '& .MuiTablePagination-displayedRows': {
        color: `${customSettings?.paginationConfig?.textColor || theme.palette.text.primary} !important`,
        fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
        margin: isMobile ? theme.spacing(0.5, 0) : 'inherit',
        order: isMobile ? 3 : 'inherit',
        width: isMobile ? '100%' : 'auto',
        textAlign: isMobile ? 'center' : 'inherit',
      },
      '& .MuiTablePagination-select': {
        backgroundColor: `${customSettings?.paginationConfig?.selectBackgroundColor || theme.palette.background.paper} !important`,
        color: `${customSettings?.paginationConfig?.selectTextColor || theme.palette.text.primary} !important`,
        fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
        borderRadius: '4px',
        border: `1px solid ${customSettings?.activityTableConfig?.borderColor || theme.palette.divider}`,
        marginLeft: isMobile ? theme.spacing(0.5) : theme.spacing(1),
        marginRight: isMobile ? theme.spacing(1) : theme.spacing(2),
        order: isMobile ? 2 : 'inherit',
        '&:focus': {
          backgroundColor: `${customSettings?.paginationConfig?.selectBackgroundColor || theme.palette.background.paper} !important`,
        },
        '&:hover': {
          backgroundColor: `${customSettings?.paginationConfig?.buttonHoverColor || theme.palette.action.hover} !important`,
        },
      },
      '& .MuiTablePagination-actions': {
        marginLeft: isMobile ? 'auto' : theme.spacing(2.5),
        order: isMobile ? 4 : 'inherit',
      },
      '& .MuiIconButton-root': {
        color: `${customSettings?.paginationConfig?.buttonColor || theme.palette.text.primary} !important`,
        padding: isMobile ? theme.spacing(0.5) : theme.spacing(1),
        '&:hover': {
          backgroundColor: `${customSettings?.paginationConfig?.buttonHoverColor || theme.palette.action.hover} !important`,
        },
        '&.Mui-disabled': {
          color: `${theme.palette.text.disabled} !important`,
        },
        '& .MuiSvgIcon-root': {
          fontSize: isMobile ? theme.typography.body1.fontSize : theme.typography.h6.fontSize,
        },
      },
      '& .MuiSelect-icon': {
        color: `${customSettings?.paginationConfig?.selectTextColor || theme.palette.text.primary} !important`,
      },
      '& .MuiInputBase-root': {
        backgroundColor: `${customSettings?.paginationConfig?.selectBackgroundColor || theme.palette.background.paper} !important`,
      },
      [theme.breakpoints.down('xs')]: {
        '& .MuiTablePagination-toolbar': {
          padding: theme.spacing(1, 0.5),
        },
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
          fontSize: theme.typography.caption.fontSize,
        },
      },
    },
  };

  return (
    <Box sx={activityStyles}>
      <UserActivityTable />
    </Box>
  );
};

const CustomEvmWalletContainer = ({ customSettings }: Props) => {
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
  const [isTableOpen, setIsTableOpen] = useState(isDesktop);
  const [search, setSearch] = useState("");
  const [isBalancesVisible, setIsBalancesVisible] = useAtom(isBalancesVisibleAtom);

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

  const getContainerBackground = () => {
    if (customSettings?.backgroundType === 'image' && customSettings?.backgroundImage) {
      return `url(${customSettings.backgroundImage})`;
    } else if (customSettings?.backgroundType === 'solid') {
      return customSettings.backgroundColor || theme.palette.background.default;
    } else if (customSettings?.backgroundType === 'gradient') {
      const from = customSettings?.gradientStartColor || theme.palette.background.default;
      const to = customSettings?.gradientEndColor || theme.palette.background.paper;
      const direction = customSettings?.gradientDirection || 'to bottom';

      const directionMap: Record<string, string> = {
        'to bottom': '180deg',
        'to top': '0deg',
        'to right': '90deg',
        'to left': '270deg',
        'to bottom right': '135deg',
        'to bottom left': '225deg',
      };
      const gradientDirection = directionMap[direction] || '180deg';
      return `linear-gradient(${gradientDirection}, ${from}, ${to})`;
    }
    return theme.palette.background.default;
  };

  const containerStyle = {
    minHeight: '100vh',
    background: getContainerBackground(),
    backgroundSize: customSettings?.backgroundSize || 'cover',
    backgroundPosition: customSettings?.backgroundPosition || 'center',
    backgroundRepeat: customSettings?.backgroundRepeat || 'no-repeat',
    backgroundAttachment: customSettings?.backgroundAttachment || 'scroll',
  };

  const getButtonStyles = (buttonConfig: any) => ({
    backgroundColor: buttonConfig?.backgroundColor || theme.palette.primary.main,
    color: buttonConfig?.textColor || theme.palette.primary.contrastText,
    borderColor: buttonConfig?.borderColor || theme.palette.primary.main,
    '&:hover': {
      backgroundColor: buttonConfig?.hoverBackgroundColor || theme.palette.primary.dark,
    },
  });

  const shouldHideElement = (element: string) => {
    return customSettings?.visibility?.[`hide${element.charAt(0).toUpperCase() + element.slice(1)}` as keyof typeof customSettings.visibility] || false;
  };

  const getLayoutSpacing = () => customSettings?.layout?.spacing || 2;

  const getActionButtonsJustifyContent = () => {
    const alignment = customSettings?.layout?.actionButtonsAlignment || 'left';
    return alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start';
  };

  const getActionButtonsDirection = () => {
    const layout = customSettings?.layout?.actionButtonsLayout || 'horizontal';
    return layout === 'vertical' ? 'column' : 'row';
  };

  return (
    <Box sx={containerStyle}>
      <Container maxWidth="md" sx={{ py: 4 }}>
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

        <Grid container spacing={getLayoutSpacing()}>
          <Grid item xs={12}>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={12} sm="auto">
                <Typography
                  variant="h5"
                  sx={{
                    color: customSettings?.primaryTextColor || theme.palette.text.primary,
                    fontWeight: 'bold',
                  }}
                >
                  <FormattedMessage
                    id="wallet"
                    defaultMessage="Wallet"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm="auto" sx={{ ml: "auto" }}>
                <Stack direction="row" spacing={1}>
                  {!shouldHideElement('networkSelector') && (
                    <CustomNetworkSelectButton
                      customSettings={customSettings}
                      chainId={chainId}
                      onChange={(newChainId) => setChainId(newChainId)}
                    />
                  )}
                  <IconButton onClick={handleToggleVisibility}>
                    {isBalancesVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                  <IconButton onClick={handleToggleBalances}>
                    {isTableOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {!shouldHideElement('balance') && (
            <Grid item xs={12}>
              <CustomWalletTotalBalance
                customSettings={customSettings}
                chainId={chainId}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Grid
              container
              spacing={getLayoutSpacing()}
              direction={getActionButtonsDirection() as 'row' | 'column'}
              justifyContent={getActionButtonsJustifyContent()}
              alignItems={customSettings?.layout?.actionButtonsLayout === 'vertical' ? (customSettings?.layout?.actionButtonsAlignment === 'center' ? 'center' : customSettings?.layout?.actionButtonsAlignment === 'right' ? 'flex-end' : 'flex-start') : 'center'}
            >
              {!shouldHideElement('receiveButton') && (
                <Grid item xs={customSettings?.layout?.actionButtonsLayout === 'grid' ? 12 : undefined} sm={customSettings?.layout?.actionButtonsLayout === 'grid' ? 4 : undefined}>
                  <Button
                    onClick={handleOpenReceive}
                    variant="outlined"
                    startIcon={<VerticalAlignBottomIcon />}
                    disabled={!isActive}
                    fullWidth={customSettings?.layout?.actionButtonsLayout === 'vertical' || customSettings?.layout?.actionButtonsLayout === 'grid'}
                    sx={getButtonStyles(customSettings?.receiveButtonConfig)}
                  >
                    <FormattedMessage
                      id="receive"
                      defaultMessage="Receive"
                    />
                  </Button>
                </Grid>
              )}
              {!shouldHideElement('sendButton') && (
                <Grid item xs={customSettings?.layout?.actionButtonsLayout === 'grid' ? 12 : undefined} sm={customSettings?.layout?.actionButtonsLayout === 'grid' ? 4 : undefined}>
                  <CustomTransferCoinButton
                    customSettings={customSettings}
                    buttonConfig={customSettings?.sendButtonConfig}
                    fullWidth={customSettings?.layout?.actionButtonsLayout === 'vertical' || customSettings?.layout?.actionButtonsLayout === 'grid'}
                  />
                </Grid>
              )}
              {!shouldHideElement('scanButton') && (
                <Grid item xs={customSettings?.layout?.actionButtonsLayout === 'grid' ? 12 : undefined} sm={customSettings?.layout?.actionButtonsLayout === 'grid' ? 4 : undefined}>
                  <Button
                    onClick={handleOpenQrCode}
                    startIcon={<QrCodeScanner />}
                    variant="outlined"
                    fullWidth={customSettings?.layout?.actionButtonsLayout === 'vertical' || customSettings?.layout?.actionButtonsLayout === 'grid'}
                    sx={getButtonStyles(customSettings?.scanButtonConfig)}
                  >
                    <FormattedMessage id="scan" defaultMessage="Scan" />
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {!shouldHideElement('search') && (
            <Grid item xs={12}>
              <Grid container spacing={getLayoutSpacing()} alignItems="center">
                <Grid
                  item
                  xs={isDesktop ? undefined : 12}
                  sm={isDesktop ? true : undefined}
                >
                  <TextField
                    size="small"
                    type="search"
                    placeholder="Search tokens..."
                    onChange={(ev) => setSearch(ev.currentTarget.value)}
                    fullWidth
                    sx={{
                      backgroundColor: customSettings?.tokenSearchConfig?.backgroundColor || theme.palette.background.default,
                      borderRadius: theme.shape.borderRadius,
                      '& .MuiInputBase-root': {
                        color: `${customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary} !important`,
                        backgroundColor: `${customSettings?.tokenSearchConfig?.backgroundColor || theme.palette.background.default} !important`,
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: `${customSettings?.tokenSearchConfig?.borderColor || theme.palette.divider} !important`,
                        },
                        '&:hover fieldset': {
                          borderColor: `${customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main} !important`,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: `${customSettings?.tokenSearchConfig?.focusBorderColor || theme.palette.primary.main} !important`,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: `${customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary} !important`,
                        '&::placeholder': {
                          color: `${customSettings?.tokenSearchConfig?.placeholderColor || theme.palette.text.secondary} !important`,
                          opacity: 1,
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Search sx={{
                            color: `${customSettings?.tokenSearchConfig?.iconColor || customSettings?.tokenSearchConfig?.textColor || theme.palette.text.primary} !important`
                          }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {!shouldHideElement('importToken') && (
                  <Grid item xs={isDesktop ? undefined : 12}>
                    <Button
                      onClick={handleOpenImportTokenDialog}
                      variant="outlined"
                      disabled={!isActive}
                      startIcon={<ImportExportIcon />}
                      fullWidth
                      sx={getButtonStyles(customSettings?.importTokenButtonConfig)}
                    >
                      <FormattedMessage
                        id="import.token"
                        defaultMessage="Import token"
                      />
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <CustomWalletBalances
              customSettings={customSettings}
              filter={search}
            />
          </Grid>

          {!shouldHideElement('activity') && (
            <Grid item xs={12}>
              <CustomUserActivityTable customSettings={customSettings} />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomEvmWalletContainer;